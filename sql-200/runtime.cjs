'use strict';
const assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
function splitSQL(sql) {
  let parts=[],start=0,quote=null,line=false,block=false;
  for(let i=0;i<sql.length;i++) {
    const c=sql[i],n=sql[i+1];
    if(line){if(c==='\n')line=false;continue;}
    if(block){if(c==='*'&&n==='/'){block=false;i++;}continue;}
    if(quote){if(c===quote){if(n===quote){i++;}else quote=null;}continue;}
    if(c==='-'&&n==='-'){line=true;i++;continue;}
    if(c==='/'&&n==='*'){block=true;i++;continue;}
    if(c==="'"||c==='"'||c==='`'){quote=c;continue;}
    if(c==='['){quote=']';continue;}
    if(c===';'){parts.push(sql.slice(start,i));start=i+1;}
  }
  if(quote||block)throw new SyntaxError('Unterminated SQL literal or block comment');
  parts.push(sql.slice(start));
  return parts.filter(s=>s.replace(/--[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').trim());
}
function execute(db,sql,params) {
  const statements=splitSQL(sql);let result=[];
  for(let i=0;i<statements.length;i++){
    const stmt=db.prepare(statements[i]);
    const bound=params&&i===statements.length-1 ? params : [];
    let values;
    if(Array.isArray(bound)) values=stmt.all(...bound);
    else values=stmt.all(bound);
    result=values.map(r=>Object.fromEntries(Object.entries(r)));
    // EXPLAIN QUERY PLAN: node ids and parent links are version-dependent metadata, not the learning target.
    if(stmt.columns().map(c=>c.name).join(',')==='id,parent,notused,detail') result=result.map(r=>({detail:r.detail}));
  }
  return result;
}
function checkProbes(db,probes) {
  for(const p of probes){
    if(p.reject){assert.throws(()=>db.exec(p.sql),new RegExp(p.reject));}
    else assert.deepEqual(execute(db,p.sql),p.expected);
  }
}
module.exports=function grade(sql,spec){
  const db=new DatabaseSync(':memory:');let phase='seed';
  try{
    db.exec('PRAGMA foreign_keys=ON;');db.exec(spec.seed);
    phase='execute';const actual=execute(db,sql,spec.params);
    phase='assert';assert.deepEqual(actual,spec.expected,'Exact rows/order do not match expected result');
    phase='integrity';if(spec.probes)checkProbes(db,spec.probes);
    return {rows:actual.length};
  }catch(e){e.phase=phase;throw e;}finally{db.close();}
};
