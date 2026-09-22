'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom'),esbuild=require('esbuild');
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/'});
for(const key of ['window','document','navigator','HTMLElement','HTMLInputElement','Node','Event','KeyboardEvent','MutationObserver'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react');const {render,fireEvent,cleanup,act}=require('@testing-library/react');
const manifest=require('./manifest.json');assert.equal(manifest.length,65);assert.equal(new Set(manifest.map(x=>x.id)).size,65);
const option=process.argv.find(a=>a.startsWith('--id='));const entries=option?manifest.filter(x=>x.id===Number(option.slice(5))):manifest;
if(!entries.length)throw new Error('Unknown id');const mode=process.argv.includes('--starters')?'starter':'solution';
(async()=>{let passed=0,failed=0;for(const row of entries){try{
 for(const field of ['starter','solution'])await esbuild.transform(fs.readFileSync(path.join(__dirname,row[field]),'utf8'),{loader:'jsx',jsx:'automatic'});
 const result=await esbuild.build({entryPoints:[path.join(__dirname,row[mode])],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',packages:'external',logLevel:'silent'});
 const Module=require('node:module');const m=new Module(path.join(__dirname,'runtime.cjs'),module);m.filename=path.join(__dirname,'runtime.cjs');m.paths=module.paths;m._compile(result.outputFiles[0].text,m.filename);
 await require(path.join(__dirname,row.test))({Component:m.exports.default,React,render,fireEvent,act});passed++;console.log('PASS '+row.id+' '+row.title);
 }catch(e){failed++;console.error('FAIL '+row.id+' '+e.stack);}finally{cleanup();document.body.innerHTML='';}}
 console.log(mode+' DOM interaction tests: '+passed+' passed, '+failed+' failed.');dom.window.close();process.exitCode=failed?1:0;
})().catch(e=>{console.error(e);dom.window.close();process.exitCode=1;});
