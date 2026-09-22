'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let id,starters=false,inventory=false;
function usage(message){console.error(message+'\nUsage: node verify.cjs [--inventory | [--starters] [--id=Q001 | --id=1]]');process.exit(2);}
try {
  const args=process.argv.slice(2),seen=new Set();
  for(let i=0;i<args.length;i++){
    const a=args[i];
    if(a==='--starters'||a==='--inventory'){
      if(seen.has(a))throw Error('Duplicate option '+a);seen.add(a);
      if(a==='--starters')starters=true;else inventory=true;
    }else if(a==='--id'||a.startsWith('--id=')){
      if(id!==undefined)throw Error('Duplicate id');
      const raw=a==='--id'?args[++i]:a.slice(5);
      if(!/^(?:Q\d{3}|\d+)$/.test(raw||''))throw Error('Invalid id');
      const n=Number(raw.replace(/^Q/,''));if(n<1||n>200||!Number.isSafeInteger(n))throw Error('Id out of range');
      id='Q'+String(n).padStart(3,'0');
    }else throw Error('Unknown option '+a);
  }
  if(inventory&&(starters||id!==undefined))throw Error('--inventory cannot combine with grading flags');
}catch(e){usage(e.message);}
let manifest;
try {
  manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
  assert.equal(manifest.length,200);assert.equal(new Set(manifest.map(r=>r.id)).size,200);
  assert.equal(new Set(manifest.map(r=>r.family)).size,20);
  const seen=new Set(),counts=new Map();
  for(const [i,r] of manifest.entries()){
    assert.equal(r.id,'Q'+String(i+1).padStart(3,'0'));assert.equal(r.scenario,i%10+1);assert.equal(r.tech,'sql');
    assert.ok(r.variant&&r.semanticKey);assert.ok(!seen.has(r.family+'|'+r.semanticKey));seen.add(r.family+'|'+r.semanticKey);
    counts.set(r.family,(counts.get(r.family)||0)+1);
    for(const key of ['prompt','starter','solution','test']){
      assert.equal(typeof r[key],'string');assert.ok(!path.isAbsolute(r[key])&&!r[key].split(/[\\/]/).includes('..'));
      assert.ok(fs.statSync(path.join(__dirname,r[key])).isFile(),r.id+' missing '+key);
    }
    assert.ok(fs.readFileSync(path.join(__dirname,r.prompt),'utf8').includes(r.id));
  }
  for(const count of counts.values())assert.equal(count,10);
}catch(e){usage('Inventory/manifest error: '+e.message);}
if(inventory){console.log('Inventory: 200 prompts, 200 starters, 200 solutions, 200 shared tests; Q001..Q200; 20 families; no database opened.');process.exit(0);}
const mode=starters?'starter':'solution',entries=id?manifest.filter(r=>r.id===id):manifest,results=[];
for(const row of entries){let phase='load';try{
  const source=fs.readFileSync(path.join(__dirname,row[mode]),'utf8');
  const test=require(path.join(__dirname,row.test));phase='test';test(source);
  results.push({id:row.id,family:row.family,passed:true,phase:'complete',errorType:null,error:null});
  console.log('PASS '+row.id+' '+row.family+' / scenario '+row.scenario+' / '+row.variant);
}catch(e){phase=e.phase||phase;
  results.push({id:row.id,family:row.family,passed:false,phase,errorType:e.name||'Error',error:e.message});
  console.error('FAIL '+row.id+' '+phase+' '+(e.name||'Error')+' '+e.message.slice(0,180).replace(/\n/g,' '));
}}
const passed=results.filter(r=>r.passed).length,failed=results.length-passed;
const report={track:'sql-200',mode,groups:results.length,passed,failed,results};
fs.writeFileSync(path.join(__dirname,'verification-'+mode+(id?'-'+id:'')+'.json'),JSON.stringify(report,null,2)+'\n');
console.log(mode+' SQL groups: '+passed+' passed, '+failed+' failed.');
process.exitCode=failed?1:0;
