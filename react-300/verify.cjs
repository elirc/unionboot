'use strict';
 const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
 const args=process.argv.slice(2);let id,starters=false,inventory=false;
 try{for(let i=0;i<args.length;i++){const a=args[i];if(a==='--starters')starters=true;else if(a==='--inventory')inventory=true;else if(a==='--id'||a.startsWith('--id=')){if(id!==undefined)throw Error('Duplicate id');const raw=a==='--id'?args[++i]:a.slice(5);if(!/^\d+$/.test(raw||''))throw Error('Invalid id');id=Number(raw);}else throw Error('Unknown option '+a);}}catch(e){console.error(e.message);process.exit(2);}
 const manifest=require('./manifest.json');assert.equal(manifest.length,300);assert.equal(new Set(manifest.map(x=>x.id)).size,300);assert.equal(new Set(manifest.map(x=>x.family)).size,30);
 manifest.forEach((row,i)=>{assert.equal(row.id,1419+i);assert.equal(row.scenario,i%10+1);for(const k of ['prompt','starter','solution','test'])assert.ok(fs.statSync(path.join(__dirname,row[k])).isFile());});
 const entries=id===undefined?manifest:manifest.filter(x=>x.id===id);if(!entries.length){console.error('Unknown id '+id);process.exit(2);}
 if(inventory){console.log('Inventory: 300 prompts, starters, solutions and DOM groups; IDs 1419..1718; 30 families.');process.exit(0);}
 const {JSDOM}=require('jsdom'),esbuild=require('esbuild'),Module=require('node:module');
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/'});
 for(const key of ['window','document','navigator','HTMLElement','HTMLInputElement','Node','Event','KeyboardEvent','MutationObserver'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=require('react'),{render,fireEvent,cleanup,act}=require('@testing-library/react');
 const mode=starters?'starter':'solution',results=[];
 (async()=>{for(const row of entries){let phase='compile';try{
 const source=fs.readFileSync(path.join(__dirname,row[mode]),'utf8');
 const transformed=await esbuild.transform(source,{loader:'jsx',format:'cjs',jsx:'automatic',sourcefile:row[mode]});
 const filename=path.join(__dirname,'runtime-'+row.id+'.cjs'),m=new Module(filename,module);m.filename=filename;m.paths=module.paths;m._compile(transformed.code,filename);
 phase='dom';await require(path.join(__dirname,row.test))({Component:m.exports.default,React,render,fireEvent,act});
 results.push({id:row.id,passed:true});console.log('PASS '+row.id+' '+row.title);
 }catch(e){results.push({id:row.id,passed:false,phase,error:e.stack});console.error('FAIL '+row.id+' '+phase+' '+e.message.slice(0,800));}finally{cleanup();document.body.innerHTML='';}}
 const passed=results.filter(x=>x.passed).length,failed=results.length-passed;
 const report={track:'react-300',mode,groups:results.length,passed,failed,results};
 fs.writeFileSync(path.join(__dirname,'verification-'+mode+(id===undefined?'':'-'+id)+'.json'),JSON.stringify(report,null,2)+'\n');
 console.log(mode+' DOM groups: '+passed+' passed, '+failed+' failed.');dom.window.close();esbuild.stop();process.exitCode=failed?1:0;
 })().catch(e=>{console.error(e);dom.window.close();esbuild.stop();process.exitCode=1;});
