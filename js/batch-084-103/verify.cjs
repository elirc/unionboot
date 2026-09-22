'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const manifest=require('./manifest.json');
assert.deepEqual(manifest.map(x=>x.id),Array.from({length:20},(_,i)=>84+i));
const args=process.argv.slice(2);
for(const arg of args)if(arg!=='--starters'&&!/^--id=\d+$/.test(arg))throw new Error('Unknown argument: '+arg);
const selected=args.find(a=>a.startsWith('--id='));
const entries=selected?manifest.filter(x=>x.id===Number(selected.slice(5))):manifest;
if(!entries.length)throw new Error('Unknown exercise id');
const mode=args.includes('--starters')?'starter':'solution';
let passed=0,failed=0;
for(const entry of entries){
 try {
  for(const field of ['starter','solution','test'])new vm.Script(fs.readFileSync(path.join(__dirname,entry[field]),'utf8'),{filename:entry[field]});
  const solve=require('./'+entry[mode]);
  assert.equal(typeof solve,'function');
  require('./'+entry.test)(solve);
  passed++;console.log('PASS '+entry.id+' '+entry.title);
 }catch(error){failed++;console.error('FAIL '+entry.id+': '+error.stack);}
}
console.log(mode+' checks: '+passed+' passed, '+failed+' failed; '+entries.length+' exercises.');
console.log('Blank starters are intentional; syntax checking is not correctness verification.');
process.exitCode=failed?1:0;
