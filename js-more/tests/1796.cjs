// 1796 Decimal-string arithmetic / scenario 8 — op=multiply; pad=true
// Prompt: ../prompts/1796.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"op":"multiply","pad":true};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
for(const [a,b] of [['0','0'],['0012','0007'],['999999999999999999999999','1'],['12345678901234567890','987654321'],['4','9']]){if(cfg.op==='subtract'&&BigInt(a)<BigInt(b)){assert.throws(()=>solve({a,b}),/Negative result/);continue;}const x=BigInt(a),y=BigInt(b);let result=String(cfg.op==='add'?x+y:cfg.op==='difference'?(x>y?x-y:y-x):cfg.op==='subtract'?x-y:cfg.op==='multiply'?x*y:x>y?x:y);if(cfg.pad)result=result.padStart(Math.max(a.length,b.length),'0');check({a,b},result);}assert.throws(()=>solve({a:'1.2',b:'0'}),/Decimal digits/);
};
