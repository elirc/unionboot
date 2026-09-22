'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
function main(){
 let id,starters=false,inventory=false;
 const args=process.argv.slice(2);
 for(let i=0;i<args.length;i++){const a=args[i];if(a==='--starters')starters=true;else if(a==='--inventory')inventory=true;else if(a==='--id'||a.startsWith('--id=')){if(id)throw Error('Duplicate id');const raw=a==='--id'?args[++i]:a.slice(5);if(!/^(?:W)?\d{3}$/i.test(raw||''))throw Error('ID must be 301..600 or W301..W600');const n=Number(raw.replace(/^W/i,''));if(n<301||n>600)throw Error('Unknown id '+raw);id='W'+n;}else throw Error('Unknown option '+a);}
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
 assert.equal(manifest.length,300);assert.equal(new Set(manifest.map(x=>x.family)).size,30);assert.equal(new Set(manifest.map(x=>x.family+'|'+x.semanticKey)).size,300);
 manifest.forEach((row,i)=>{assert.equal(row.id,'W'+(301+i));assert.equal(row.scenario,i%10+1);assert.ok(row.semanticKey);for(const key of ['prompt','starter','solution','test'])assert.ok(fs.statSync(path.join(__dirname,row[key])).isFile());});
 for(const family of new Set(manifest.map(x=>x.family)))assert.equal(manifest.filter(x=>x.family===family).length,10);
 for(const folder of ['prompts','starters','solutions','tests'])assert.equal(fs.readdirSync(path.join(__dirname,folder)).length,300);
 const mode=starters?'starter':'solution',set=starters?'starters':'solutions',suffix=mode+(id?'-'+id:'');
 const reportFile=path.join(__dirname,'verification-'+suffix+'.json');
 const base={track:'dotnet-web-more',mode,scope:'in-process ASP.NET Core; no network',selected:id||'all',groups:id?1:300};
 if(inventory){fs.writeFileSync(path.join(__dirname,'inventory.json'),JSON.stringify({...base,phase:'inventory',inventory:{exercises:300,families:30,scenariosPerFamily:10},passed:300,failed:0},null,2)+'\n');console.log('Inventory OK: 300 exercises; 30 families x10; unique family|semanticKey; W301..W600. No compile performed.');return 0;}
 const buildArgs=['build',path.join(__dirname,'WebExercises.csproj'),'--configuration','Debug','--nologo','--verbosity','minimal','--disable-build-servers','-m:1','-p:ExerciseSet='+set,'-p:RestoreConfigFile='+path.join(__dirname,'NuGet.Config')];
 console.log('Compile '+set+' only (all 300 classes; single sequential project).');
 const built=cp.spawnSync('dotnet',buildArgs,{cwd:__dirname,encoding:'utf8',maxBuffer:32*1024*1024,timeout:600000,env:{...process.env,DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE:'1'}});
 const buildLog=(built.stdout||'')+(built.stderr||'')+(built.error?String(built.error):'');fs.writeFileSync(path.join(__dirname,'build-'+suffix+'.log'),buildLog);process.stdout.write(buildLog);
 if(built.error||built.status!==0){fs.writeFileSync(reportFile,JSON.stringify({...base,phase:'build',buildPassed:false,passed:0,failed:0,notRun:base.groups,buildExitCode:built.status,error:built.error?String(built.error):'Build failed; see build log',results:[]},null,2)+'\n');return 2;}
 const raw=path.join(__dirname,'runtime-'+suffix+'.json');if(fs.existsSync(raw))fs.unlinkSync(raw);
 const runArgs=[path.join(__dirname,'bin','Debug','net10.0','WebExercises.dll'),'--report',raw];if(id)runArgs.push('--id',id);
 const ran=cp.spawnSync('dotnet',runArgs,{cwd:__dirname,encoding:'utf8',maxBuffer:32*1024*1024,timeout:600000,env:{...process.env,DOTNET_CLI_TELEMETRY_OPTOUT:'1'}});
 const testLog=(ran.stdout||'')+(ran.stderr||'')+(ran.error?String(ran.error):'');fs.writeFileSync(path.join(__dirname,'tests-'+suffix+'.log'),testLog);process.stdout.write(testLog);
 if(!fs.existsSync(raw)){fs.writeFileSync(reportFile,JSON.stringify({...base,phase:'tests',buildPassed:true,passed:0,failed:base.groups,error:'Runner failed to produce JSON',runnerExitCode:ran.status,results:[]},null,2)+'\n');return ran.status===2?2:1;}
 const report=JSON.parse(fs.readFileSync(raw,'utf8'));assert.equal(report.groups,base.groups);fs.writeFileSync(reportFile,JSON.stringify({...base,...report,buildPassed:true,buildExitCode:0,runnerExitCode:ran.status},null,2)+'\n');return ran.status===0&&report.failed===0?0:1;
}
try{process.exitCode=main();}catch(e){console.error(e.stack);process.exitCode=2;}
