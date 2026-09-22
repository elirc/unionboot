'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=__dirname;
function argumentsOf(args){let id=null,starter=false,inventory=false;const seen=new Set();for(let i=0;i<args.length;i++){const arg=args[i];let key;if(arg==='--starters'){key='starters';starter=true;}else if(arg==='--inventory'){key='inventory';inventory=true;}else if(arg==='--id'||arg.startsWith('--id=')){key='id';const value=arg==='--id'?args[++i]:arg.slice(5);if(!value||!/^\d+$/.test(value))throw Error('--id needs an integer');id=Number(value);}else throw Error('Unknown argument: '+arg);if(seen.has(key))throw Error('Duplicate argument: '+key);seen.add(key);}return {id,starter,inventory};}
function inventory(manifest){assert.equal(manifest.length,750);assert.deepEqual(manifest.map(r=>r.id),Array.from({length:750},(_,i)=>1969+i));const seen=new Set(),groups=new Map();for(const row of manifest){assert.equal(row.tech,'ts');const key=row.family+'|'+row.semanticKey;assert.ok(!seen.has(key),'Duplicate semantic contract '+key);seen.add(key);groups.set(row.family,(groups.get(row.family)||0)+1);for(const field of ['prompt','starter','solution','test','positive','negative'])assert.ok(fs.statSync(path.join(root,row[field])).isFile(),'Missing '+field+' '+row.id);const negative=fs.readFileSync(path.join(root,row.negative),'utf8');assert.equal((negative.match(/@ts-expect-error/g)||[]).length,4);for(const field of ['positive','negative'])assert.ok(fs.readFileSync(path.join(root,row[field]),'utf8').includes("'../solutions/"+row.id+"'"),'Bad fixture import '+row.id);}assert.equal(groups.size,50);for(const count of groups.values())assert.equal(count,15);return {count:manifest.length,families:groups.size,first:1969,last:2718,files:4500};}
async function main(){
 const args=argumentsOf(process.argv.slice(2)),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));const stats=inventory(manifest);
 const selected=args.id===null?manifest:manifest.filter(r=>r.id===args.id);if(!selected.length)throw Error('Unknown id: '+args.id);
 if(args.inventory){console.log(JSON.stringify({...stats,selected:selected.length},null,2));return;}
 assert.equal(require('typescript/package.json').version,'5.9.3','Requires existing pinned TypeScript 5.9.3');
 const mode=args.starter?'starter':'solution',log=[];const say=text=>{log.push(text);console.log(text);};
 const compilerTimeoutMs=args.id===null?2400000:300000;
 const report={track:'ts-next',mode,scope:args.id===null?'full':'single-id',requestedIds:selected.map(r=>r.id),compilerVersion:'5.9.3',compilerTimeoutMs,compilerPassed:false,runtimeStarted:false,blankControlPassed:false,passed:0,failed:0,exitCode:2,results:[]};
 const workRoot=path.join(root,'.verify');fs.mkdirSync(workRoot,{recursive:true});const work=fs.mkdtempSync(path.join(workRoot,'run-')),build=path.join(work,'build');
 try{
  const files=[];
  for(const row of selected){files.push(path.join(root,row[mode]));for(const field of ['positive','negative']){const source=fs.readFileSync(path.join(root,row[field]),'utf8');const token="'../solutions/"+row.id+"'";assert.ok(source.includes(token));const rebound=source.split(token).join(JSON.stringify('../../'+row[mode].replace(/\.ts$/,'')));assert.ok(!rebound.includes(token),'Fixture import was not rebound');if(args.starter)assert.ok(!rebound.includes('/solutions/'),'Starter fixture still bound to solution');const fixture=path.join(work,path.basename(row[field]));fs.writeFileSync(fixture,rebound);files.push(fixture);}}
  const config=path.join(work,'tsconfig.json');const base=JSON.parse(fs.readFileSync(path.join(root,'tsconfig.json'),'utf8'));fs.writeFileSync(config,JSON.stringify({compilerOptions:{...base.compilerOptions,rootDir:root,outDir:build},files}));
  say('TypeScript compiler gate: START (5.9.3; '+selected.length+' '+mode+' APIs; positive + negative fixtures bound to candidate).');
  const compiled=spawnSync(process.execPath,[require.resolve('typescript/lib/tsc.js'),'-p',config],{encoding:'utf8',timeout:compilerTimeoutMs,maxBuffer:16*1024*1024});
  if(compiled.stdout)say(compiled.stdout.trimEnd());if(compiled.stderr)say(compiled.stderr.trimEnd());if(compiled.error)say(String(compiled.error));
  if(compiled.status!==0){say('TypeScript compiler gate: FAILED; runtime tests NOT RUN.');report.results=selected.map(r=>({id:r.id,compiler:'failed',runtime:'not-run',todoMatch:false}));return;}
  report.compilerPassed=true;say('TypeScript compiler gate: PASSED before runtime.');report.runtimeStarted=true;
  for(const row of selected){try{const candidate=require(path.join(build,row[mode].replace(/\.ts$/,'.js')));assert.equal(typeof candidate.solve,'function');await require(path.join(root,row.test))(candidate.solve);report.passed++;report.results.push({id:row.id,compiler:'passed',runtime:'passed',todoMatch:false});say('PASS '+row.id+' '+row.title);}catch(error){const diagnostic=error&&error.stack||String(error);const todoMatch=!!error&&error.message==='TODO exercise '+row.id;report.failed++;report.results.push({id:row.id,compiler:'passed',runtime:'failed',todoMatch,diagnostic});say('FAIL '+row.id+' '+diagnostic);}}
  report.exitCode=report.failed?1:0;report.blankControlPassed=args.starter&&report.failed===selected.length&&report.results.every(r=>r.compiler==='passed'&&r.runtime==='failed'&&r.todoMatch);
  say(mode+': '+report.passed+' passed, '+report.failed+' failed.');if(args.starter)say('Blank control: '+(report.blankControlPassed?'PASSED (tsc passed, every runtime diagnostic matches its TODO exercise ID)':'NOT PROVEN (requires successful compiler and matching TODO for every selected ID)'));
 }catch(error){report.exitCode=2;say('SETUP ERROR: '+(error.stack||String(error)));}
 finally{
  report.completedAt=new Date().toISOString();fs.mkdirSync(path.join(root,'reports'),{recursive:true});
  const filename='verification-'+mode+(args.id===null?'':'-'+args.id)+'.json';fs.writeFileSync(path.join(root,filename),JSON.stringify(report,null,2)+'\n');
  // A single-ID run also updates the aggregate name with an explicit single-id scope; never claims a full suite.
  if(args.id!==null)fs.writeFileSync(path.join(root,'verification-'+mode+'.json'),JSON.stringify(report,null,2)+'\n');
  for(const result of report.results)fs.writeFileSync(path.join(root,'reports',mode+'-'+result.id+'.json'),JSON.stringify({mode,compilerVersion:'5.9.3',...result},null,2)+'\n');
  fs.appendFileSync(path.join(root,args.starter?'blank-control.log':'verification.log'),'\n=== '+report.completedAt+' '+report.scope+' ===\n'+log.join('\n')+'\nexitCode='+report.exitCode+'\n');
  fs.rmSync(work,{recursive:true,force:true});process.exitCode=report.exitCode;
 }
}
main().catch(error=>{console.error('SETUP ERROR: '+(error.stack||String(error)));process.exitCode=2;});
