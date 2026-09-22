'use strict';
// Only integrated tracks belong here; in-progress authoring directories are excluded.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=__dirname;
const args=process.argv.slice(2);
if(args.length>1||(args.length===1&&args[0]!=='--inventory')){
 console.error('Usage: node verify-all.cjs [--inventory]');process.exit(2);
}
const inventoryOnly=args[0]==='--inventory';
const tracks=['js/batch-084-103','js-rest','ts','react','mixed-data','mixed-react','react-more','ts-more','ts-final','react-junior','react-300'];
const csharpPacks=[{source:'CSHARP-583.cs',verifier:'verify-csharp.cjs',first:1,count:583},{source:'CSHARP-MORE-583.cs',verifier:'verify-csharp-more.cjs',first:584,count:583}];
const separatePacks=[{track:'dotnet-web-300',tech:'dotnetWeb',prefix:'W',first:1,count:300},{track:'sql-200',tech:'sql',prefix:'Q',first:1,count:200}];
const counts={js:83,ts:0,react:0,csharp:0,dotnetWeb:0,sql:0};
const ids=Array.from({length:83},(_,i)=>i+1),manifests=new Map();
function readManifest(track){
 const rows=JSON.parse(fs.readFileSync(path.join(root,track,'manifest.json'),'utf8'));
 for(const row of rows)for(const field of ['starter','solution','test']){
  assert.equal(typeof row[field],'string');
  assert.ok(!path.isAbsolute(row[field])&&!row[field].split(/[\\/]/).includes('..'),'Local asset path');
  assert.ok(fs.statSync(path.join(root,track,row[field])).isFile(),`Missing ${track}/${row[field]}`);
 }
 manifests.set(track,rows);return rows;
}
const originalFiles=fs.readdirSync(root);
for(let id=1;id<=83;id++){
 const files=originalFiles.filter(f=>f.startsWith(String(id).padStart(2,'0')+'-')&&f.endsWith('.js'));
 assert.equal(files.length,1,'Exactly one original starter '+id);
 if(!inventoryOnly){
  const result=spawnSync(process.execPath,['--check',path.join(root,files[0])],{encoding:'utf8',timeout:15000});
  assert.equal(result.status,0,'Invalid starter syntax '+id+': '+result.stderr);
 }
}
for(const track of tracks)for(const row of readManifest(track)){
 ids.push(row.id);const tech=row.tech||(track==='js/batch-084-103'?'js':null);
 assert.ok(['js','ts','react'].includes(tech),'Known technology');counts[tech]++;
}
assert.deepEqual([...ids].sort((a,b)=>a-b),Array.from({length:1718},(_,i)=>i+1),'Consecutive integrated web IDs, no gaps or duplicates');
assert.equal(counts.ts,750,'Integrated TypeScript total');
for(const pack of csharpPacks){
 pack.text=fs.readFileSync(path.join(root,pack.source),'utf8');
 const classIds=[...pack.text.matchAll(/^static class E(\d{3,4}) \{/gm)].map(m=>Number(m[1]));
 assert.deepEqual(classIds,Array.from({length:pack.count},(_,i)=>pack.first+i),pack.source+' IDs');
 counts.csharp+=classIds.length;
}
for(const pack of separatePacks){
 const rows=readManifest(pack.track);
 assert.deepEqual(rows.map(r=>r.id),Array.from({length:pack.count},(_,i)=>pack.prefix+String(pack.first+i).padStart(3,'0')),pack.track+' IDs');
 counts[pack.tech]+=rows.length;
}
const exerciseCount=Object.values(counts).reduce((a,b)=>a+b,0);
const inventory={exerciseCount,webExerciseCount:ids.length,csharpExerciseCount:counts.csharp,dotnetWebExerciseCount:counts.dotnetWeb,sqlExerciseCount:counts.sql,counts};
if(inventoryOnly){console.log(JSON.stringify(inventory,null,2));process.exit(0);}
const checks=['verify-original.cjs','verify-39-50.cjs','verify-missing.cjs',...tracks.map(t=>t+'/verify.cjs'),...csharpPacks.map(p=>p.verifier),...separatePacks.map(p=>p.track+'/verify.cjs')];
const results=[],skippedControls=[];
const logDir=path.join(root,'verification-logs');fs.mkdirSync(logDir,{recursive:true});
function runGate(file,args=[],label=file){
 const run=spawnSync(process.execPath,[path.join(root,file),...args],{cwd:root,encoding:'utf8',timeout:1800000,maxBuffer:32*1024*1024});
 const log=(run.stdout||'')+(run.stderr||'')+(run.error?'\n'+run.error.message:'');
 fs.writeFileSync(path.join(logDir,label.replace(/[^a-zA-Z0-9_.-]/g,'_')+'.log'),log);
 return {run,log};
}
function record(file,ok,run){results.push({file,ok,exit:run.status});console.log((ok?'PASS ':'FAIL ')+file);}
function skip(label){skippedControls.push(label);console.log('SKIP '+label+': blank marker absent; learner file left untouched');}
for(const file of checks){
 console.log('RUN '+file);const {run,log}=runGate(file);
 record(file,run.status===0,run);if(run.status!==0)console.error(log);
}
// These are smoke controls; absence of a blank marker is a recorded skip, not a pass.
for(const track of tracks){
 const first=manifests.get(track)[0],label=track+' starter negative control';
 if(!fs.readFileSync(path.join(root,track,first.starter),'utf8').includes('TODO')){skip(label);continue;}
 const {run}=runGate(track+'/verify.cjs',['--starters','--id='+first.id],label);
 record(label,run.status===1,run);
}
for(const pack of csharpPacks){
 const label=pack.source+' starter negative control';
 const firstClass=pack.text.split(/^static class E\d{3,4} \{/m)[1]||'';
 if(!firstClass.includes('throw new NotImplementedException("Exercise '+pack.first+'")')){skip(label);continue;}
 const {run,log}=runGate(pack.verifier,['--starters','--id='+pack.first],label);
 record(label,run.status===1&&log.includes('NotImplementedException')&&log.includes('Practice: 0 passed, 1 failed;'),run);
}
for(const pack of separatePacks){
 const first=manifests.get(pack.track)[0],label=pack.track+' starter negative control';
 const source=fs.readFileSync(path.join(root,pack.track,first.starter),'utf8');
 const blank=pack.tech==='sql'?source.trim()==='-- TODO: write your SQL here':source.includes('NotImplementedException');
 if(!blank){skip(label);continue;}
 const reportPath=path.join(root,pack.track,'verification-starter-'+first.id+'.json');
 const startedAt=Date.now();
 const {run}=runGate(pack.track+'/verify.cjs',['--starters','--id='+first.id],label);
 let ok=false;
 try{
  assert.ok(fs.statSync(reportPath).mtimeMs>=startedAt-2000,'Fresh control report');
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8')),result=report.results[0];
  ok=run.status===1&&report.mode==='starter'&&report.failed===1&&report.results.length===1&&result.id===first.id&&!result.passed;
  ok=ok&&(pack.tech==='sql'?result.phase==='assert'&&result.errorType==='AssertionError':report.buildPassed===true&&result.errorType==='NotImplementedException');
 }catch(error){console.error(label+': '+error.message);}
 record(label,ok,run);
}
const failed=results.filter(r=>!r.ok);
const report={generatedAt:new Date().toISOString(),...inventory,referenceChecks:checks.length,negativeControls:results.length-checks.length,skippedControls,results,passed:failed.length===0};
fs.writeFileSync(path.join(root,'verification-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`\n${exerciseCount} integrated exercises inventoried. ${checks.length} reference gates. ${failed.length} failed gates.`);
console.log('Technology counts: '+JSON.stringify(counts));
console.log('Verification covers documented samples and tested edges, not every possible input.');
process.exitCode=failed.length?1:0;
