'use strict';
const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');
function splitSQL(sql){
 let parts=[],start=0,q=null,line=false,block=false,hasCode=false;
 for(let i=0;i<sql.length;i++){const c=sql[i],n=sql[i+1];
 if(line){if(c==='\n')line=false;continue;}if(block){if(c==='*'&&n==='/'){block=false;i++;}continue;}
 if(q){if(c===q){if(n===q&&q!==']')i++;else q=null;}continue;}
 if(c==='-'&&n==='-'){line=true;i++;continue;}if(c==='/'&&n==='*'){block=true;i++;continue;}
 if(c===';'){if(hasCode)parts.push(sql.slice(start,i));start=i+1;hasCode=false;continue;}
 if(!/\s/.test(c))hasCode=true;if(c==="'"||c==='"'||c==='`')q=c;else if(c==='[')q=']';
 }
 if(q||block)throw new SyntaxError('Unterminated SQL quote or block comment');if(hasCode)parts.push(sql.slice(start));return parts;
}
function execute(db,sql,params){let result=[];const stmts=splitSQL(sql);for(let i=0;i<stmts.length;i++){const s=db.prepare(stmts[i]);result=s.all(...(i===stmts.length-1?(params||[]):[])).map(r=>({...r}));if(s.columns().map(c=>c.name).join(',')==='id,parent,notused,detail')result=result.map(r=>({detail:r.detail}));}return result;}
function grade(sql,spec){const db=new DatabaseSync(':memory:');let phase='seed';try{db.exec('PRAGMA foreign_keys=ON;');db.exec(spec.seed);phase='execute';const actual=execute(db,sql,spec.params);phase='assert';assert.deepEqual(actual,spec.expected,'Exact result rows/order mismatch');phase='integrity';for(const p of spec.probes||[]){if(p.reject)assert.throws(()=>db.exec(p.sql),new RegExp(p.reject));else assert.deepEqual(execute(db,p.sql),p.expected);}return {rows:actual.length};}catch(e){e.phase=phase;throw e;}finally{db.close();}}
module.exports=grade;
