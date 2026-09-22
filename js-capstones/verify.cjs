'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const args=process.argv.slice(2);let id,starters=false,inventory=false;const seen=new Set();
try{for(const arg of args){const key=arg.startsWith('--id=')?'id':arg;if(seen.has(key))throw Error('Duplicate option');seen.add(key);if(arg==='--starters')starters=true;else if(arg==='--inventory')inventory=true;else if(/^--id=\d+$/.test(arg))id=Number(arg.slice(5));else throw Error('Unknown option');}if(inventory&&(starters||id!==undefined))throw Error('Inventory cannot combine with grading');if(id!==undefined&&![3439,3440,3441].includes(id))throw Error('Unknown ID');}catch(e){console.error(e.message);process.exit(2);}
const rows=require('./manifest.json');assert.deepEqual(rows.map(r=>r.id),[3439,3440,3441]);for(const r of rows)for(const field of ['prompt','starter','solution','test'])assert.ok(fs.statSync(path.join(__dirname,r[field])).isFile());
if(inventory){console.log('3 JavaScript capstones: 3439–3441');process.exit(0);}
const mode=starters?'starter':'solution',results=[];
for(const r of rows.filter(r=>id===undefined||r.id===id)){try{require('./'+r.test)(require('./'+r[mode]));results.push({id:r.id,passed:true});console.log('PASS '+r.id);}catch(e){results.push({id:r.id,passed:false,errorType:e.name,error:e.message});console.log('FAIL '+r.id+' '+e.message);}}
const passed=results.filter(r=>r.passed).length,failed=results.length-passed;
fs.writeFileSync(path.join(__dirname,'verification-'+mode+(id?'-'+id:'')+'.json'),JSON.stringify({mode,groups:results.length,passed,failed,results},null,2)+'\n');
console.log(mode+': '+passed+' passed, '+failed+' failed');process.exitCode=failed?1:0;
