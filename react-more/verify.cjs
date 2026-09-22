'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const args=process.argv.slice(2);let id,starters=false;
try{for(let i=0;i<args.length;i++){const arg=args[i];if(arg==='--starters')starters=true;else if(arg==='--id'||arg.startsWith('--id=')){if(id!==undefined)throw new Error('Duplicate --id');const text=arg==='--id'?args[++i]:arg.slice(5);if(!/^\d+$/.test(text||''))throw new Error('Invalid --id');id=Number(text);}else throw new Error('Unknown option '+arg);}}catch(e){console.error(e.message);process.exit(2);}
const manifest=require('./manifest.json');
assert.equal(manifest.length,200);assert.equal(new Set(manifest.map(x=>x.id)).size,200);
manifest.forEach((x,i)=>{assert.equal(x.id,584+i);assert.equal(x.scenario,6+i%10);for(const field of ['prompt','starter','solution','test'])assert.ok(fs.statSync(path.join(__dirname,x[field])).isFile());});
const entries=id===undefined?manifest:manifest.filter(x=>x.id===id);
if(!entries.length){console.error('Unknown id '+id);process.exit(2);}
const baseline=require('./preservation-baseline.json');
for(const [name,hash] of Object.entries(baseline)){const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',name))).digest('hex');assert.equal(actual,hash,'Original track changed: '+name);}
const {JSDOM}=require('jsdom'),esbuild=require('esbuild');
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/'});
for(const key of ['window','document','navigator','HTMLElement','HTMLInputElement','Node','Event','KeyboardEvent','MutationObserver'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{render,fireEvent,cleanup,act}=require('@testing-library/react');
const mode=starters?'starter':'solution',results=[];
(async()=>{for(const row of entries){try{
for(const field of ['starter','solution'])await esbuild.transform(fs.readFileSync(path.join(__dirname,row[field]),'utf8'),{loader:'jsx',jsx:'automatic'});
const built=await esbuild.build({entryPoints:[path.join(__dirname,row[mode])],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',packages:'external',logLevel:'silent'});
const Module=require('node:module'),m=new Module(path.join(__dirname,'runtime.cjs'),module);m.filename=path.join(__dirname,'runtime.cjs');m.paths=module.paths;m._compile(built.outputFiles[0].text,m.filename);
await require(path.join(__dirname,row.test))({Component:m.exports.default,React,render,fireEvent,act});
results.push({id:row.id,family:row.family,scenario:row.scenario,passed:true});console.log('PASS '+row.id+' '+row.title);
}catch(e){results.push({id:row.id,family:row.family,scenario:row.scenario,passed:false,error:e.stack});console.error('FAIL '+row.id+' '+e.stack);}finally{cleanup();document.body.innerHTML='';}}
const passed=results.filter(x=>x.passed).length,failed=results.length-passed;
const report={track:'react-more',mode,selectedId:id===undefined?null:id,groups:results.length,passed,failed,originalFilesUnchanged:Object.keys(baseline).length,coverage:require('./coverage.json'),results};
fs.writeFileSync(path.join(__dirname,'verification-'+(starters?'starters':'solutions')+(id===undefined?'':'-'+id)+'.json'),JSON.stringify(report,null,2)+'\n');
console.log(mode+' DOM interaction groups: '+passed+' passed, '+failed+' failed. Original files unchanged: '+Object.keys(baseline).length+'.');dom.window.close();process.exitCode=failed?1:0;
})().catch(e=>{console.error(e);dom.window.close();process.exitCode=1;});
