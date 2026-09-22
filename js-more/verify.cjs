'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
let id,starters=false,inventory=false;const seen=new Set();
try{
 const args=process.argv.slice(2);
 for(let i=0;i<args.length;i++){
  const arg=args[i],name=arg==='--id'||arg.startsWith('--id=')?'--id':arg;
  if(seen.has(name))throw Error('Duplicate option '+name);seen.add(name);
  if(name==='--starters')starters=true;else if(name==='--inventory')inventory=true;
  else if(name==='--id'){const raw=arg==='--id'?args[++i]:arg.slice(5);if(!/^[0-9]+$/.test(raw||'')||!Number.isSafeInteger(Number(raw)))throw Error('Invalid id');id=Number(raw);}
  else throw Error('Unknown option '+arg);
 }
}catch(error){console.error(error.message);process.exit(2);}
let manifest;
try{
 manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
 assert.equal(manifest.length,250);assert.equal(new Set(manifest.map(x=>x.id)).size,250);assert.equal(new Set(manifest.map(x=>x.family)).size,25);
 const counts=new Map();
 manifest.forEach((row,i)=>{
  assert.equal(row.id,1719+i);assert.equal(row.tech,'js');assert.equal(row.scenario,i%10+1);counts.set(row.family,(counts.get(row.family)||0)+1);
  for(const field of ['family','variant','title','starter','solution','test','prompt'])assert.equal(typeof row[field],'string');
  for(const field of ['starter','solution','test','prompt']){const expected=(field==='prompt'?'prompts':field==='test'?'tests':field+'s')+'/'+row.id+(field==='prompt'?'.txt':'.cjs');assert.equal(row[field],expected);assert.ok(fs.statSync(path.join(__dirname,row[field])).isFile());}
 });
 for(const count of counts.values())assert.equal(count,10);
}catch(error){console.error('Inventory failure: '+error.stack);process.exit(1);}
if(id!==undefined&&!manifest.some(row=>row.id===id)){console.error('Unknown id '+id);process.exit(2);}
if(inventory){console.log('Inventory: 250 JS groups, 25 families, 250 prompts/starters/solutions/tests; IDs1719..1968. No grading run.');process.exit(0);}
const selected=id===undefined?manifest:manifest.filter(row=>row.id===id),mode=starters?'starter':'solution',results=[],logs=[];
const log=line=>{logs.push(line);console.log(line);};
(async()=>{
 for(const row of selected){let phase='syntax';try{
  for(const field of ['starter','solution','test']){const file=path.join(__dirname,row[field]);const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8',timeout:20000,windowsHide:true});if(checked.error)throw checked.error;if(checked.status!==0)throw Error('node --check '+row[field]+'\n'+checked.stderr+checked.stdout);}
  phase='runtime';const solve=require(path.join(__dirname,row[mode]));assert.equal(typeof solve,'function','CommonJS export must be function');await require(path.join(__dirname,row.test))(solve);
  results.push({id:row.id,passed:true,phase,error:null});log('PASS '+row.id+' '+row.title);
 }catch(error){results.push({id:row.id,passed:false,phase,error:error.stack||String(error)});log('FAIL '+row.id+' '+phase+' '+(error.stack||String(error)));}}
 const passed=results.filter(row=>row.passed).length,failed=results.length-passed;
 const report={track:'js-more',mode,groups:results.length,passed,failed,results};
 const text=JSON.stringify(report,null,2)+'\n';
 fs.writeFileSync(path.join(__dirname,'verification-'+mode+'.json'),text);
 if(id!==undefined)fs.writeFileSync(path.join(__dirname,'verification-'+mode+'-'+id+'.json'),text);
 log(mode+': '+passed+' passed, '+failed+' failed ('+results.length+' groups).');
 fs.writeFileSync(path.join(__dirname,starters?'blank.log':'reference.log'),logs.join('\n')+'\n');
 process.exitCode=failed?1:0;
})().catch(error=>{console.error(error);process.exitCode=1;});
