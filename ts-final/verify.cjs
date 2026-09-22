'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const manifest=require('./manifest.json');
const args=process.argv.slice(2);let id=null,starter=false;
for(let i=0;i<args.length;i++){
 const arg=args[i];if(arg==='--starters')starter=true;
 else if(arg==='--id'){const next=args[++i];if(!next||!/^\d+$/.test(next))throw Error('--id needs an integer');id=Number(next);}
 else if(/^--id=\d+$/.test(arg))id=Number(arg.slice(5));
 else throw Error('Unknown argument: '+arg);
}
assert.equal(manifest.length,165);assert.deepEqual(manifest.map(r=>r.id),Array.from({length:165},(_,i)=>1204+i));
const selected=id===null?manifest:manifest.filter(r=>r.id===id);if(!selected.length)throw Error('Unknown id: '+id);
const version=require('typescript/package.json').version;assert.equal(version,'5.9.3','Use the existing pinned TypeScript 5.9.3 compiler');
const mode=starter?'starter':'solution';
// Bind BOTH positive and negative fixture imports to the candidate being graded.
// Unique workspace prevents concurrent --id/whole-track checks from clobbering output.
const workRoot=path.join(__dirname,'.verify');fs.mkdirSync(workRoot,{recursive:true});
const work=fs.mkdtempSync(path.join(workRoot,'run-'));const build=path.join(work,'build');
async function main(){
 let passed=0,failed=0;
 try{
  const files=[];
  for(const row of selected){
   for(const field of ['starter','solution','test','positive','negative'])assert.ok(fs.existsSync(path.join(__dirname,row[field])),'Missing '+field+' '+row.id);
   files.push(path.join(__dirname,row[mode]));
   for(const field of ['positive','negative']){
    const source=fs.readFileSync(path.join(__dirname,row[field]),'utf8');
    const fixture=path.join(work,path.basename(row[field]));
    // work sits at track/.verify/run-xxx; two parent hops reach the track.
    fs.writeFileSync(fixture,source.replace("'../solutions/"+row.id+"'",JSON.stringify('../../'+row[mode].replace(/\.ts$/,''))));
    files.push(fixture);
   }
  }
  const base=require('./tsconfig.json');const config=path.join(work,'tsconfig.json');
  fs.writeFileSync(config,JSON.stringify({compilerOptions:{...base.compilerOptions,rootDir:__dirname,outDir:build},files}));
  const compiled=spawnSync(process.execPath,[require.resolve('typescript/lib/tsc.js'),'-p',config],{encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024});
  if(compiled.status!==0){console.error('TypeScript compiler gate: FAILED; runtime tests NOT RUN.');process.stdout.write(compiled.stdout||'');process.stderr.write(compiled.stderr||'');if(compiled.error)console.error(compiled.error);process.exitCode=2;return;}
  console.log('TypeScript compiler gate: PASSED (5.9.3; '+selected.length+' '+mode+' APIs; positive + negative strict fixtures).');
  for(const row of selected){try{
   const candidate=require(path.join(build,row[mode].replace(/\.ts$/,'.js')));
   assert.equal(typeof candidate.solve,'function');
   await require(path.join(__dirname,row.test))(candidate.solve);passed++;console.log('PASS '+row.id+' '+row.title);
  }catch(error){failed++;console.error('FAIL '+row.id+' '+(error&&error.stack||String(error)));}}
  console.log(mode+': '+passed+' passed, '+failed+' failed. TypeScript compiler gate: passed before runtime.');process.exitCode=failed?1:0;
 }finally{fs.rmSync(work,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=2;});
