// 1872 LCS edit scripts / scenario 4 — tie=insert; fold=true; output=ops
// Prompt: ../prompts/1872.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"tie":"insert","fold":true,"output":"ops"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(a,b){const equal=(x,y)=>cfg.fold?x.toLowerCase()===y.toLowerCase():x===y;const memo=new Map();function go(i,j){const key=i+','+j;if(memo.has(key))return memo.get(key);let result;if(i===a.length)result={n:0,ops:[...b.slice(j)].map(x=>['insert',x])};else if(j===b.length)result={n:0,ops:[...a.slice(i)].map(x=>['delete',x])};else if(equal(a[i],b[j])){const rest=go(i+1,j+1);result={n:rest.n+1,ops:[['keep',b[j]],...rest.ops]};}else{const del=go(i+1,j),ins=go(i,j+1),use=del.n>ins.n||(del.n===ins.n&&cfg.tie==='delete');const rest=use?del:ins;result={n:rest.n,ops:[[use?'delete':'insert',use?a[i]:b[j]],...rest.ops]};}memo.set(key,result);return result;}const r=go(0,0);return cfg.output==='length'?r.n:cfg.output==='common'?r.ops.filter(x=>x[0]==='keep').map(x=>x[1]).join(''):r.ops;}
 for(const [a,b] of [['',''],['abc',''],['','abc'],['ab','ba'],['ABC','abc'],['banana','ananas'],['abcbdab','bdcaba']])check({a,b},oracle(a,b));
};
