'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const manifest=require('./manifest.json');
assert.equal(manifest.length,80);
assert.equal(new Set(manifest.map(x=>x.id)).size,80);

const args=process.argv.slice(2),option=args.find(a=>a.startsWith('--id=')),id=option?Number(option.slice(5)):null;
const selected=id===null?manifest:manifest.filter(x=>x.id===id);if(!selected.length)throw new Error('Unknown id');
const mode=args.includes('--starters')?'starter':'solution';let passed=0,failed=0;
for(const row of selected){try{
 let target=path.join(__dirname,row[mode]);
 if(row.tech==='ts')target=path.join(__dirname,'.build',row[mode].replace(/\.ts$/,'.js'));
 else for(const field of ['starter','solution','test'])new vm.Script(fs.readFileSync(path.join(__dirname,row[field]),'utf8'));
 const loaded=require(target),solve=row.tech==='ts'?loaded.solve:loaded;
 require(path.join(__dirname,row.test))(solve);passed++;console.log('PASS '+row.id+' '+row.title);
 }catch(e){failed++;console.error('FAIL '+row.id+' '+e.stack);}}
console.log(mode+': '+passed+' passed, '+failed+' failed. TypeScript compiler gate: not applicable.');process.exitCode=failed?1:0;
