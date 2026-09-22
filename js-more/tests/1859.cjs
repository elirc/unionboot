// 1859 Precedence expression parsing / scenario 1 — precedence=standard; power=left; unaryPlus=false
// Prompt: ../prompts/1859.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"precedence":"standard","power":"left","unaryPlus":false};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const extra=cfg.offset||0;check('2 + 3 * 4',(cfg.precedence==='flat'?20:14)+extra);check('2 ^ 3 ^ 2',(cfg.power==='left'?64:512)+extra);check('(2 + 3) * 4',20+extra);check('-2 ^ 2',4+extra);check(' 1.5 * 4 - 2 ',4+extra);check('8 / 2 / 2',2+extra);if(cfg.unaryPlus)check('+2',2+extra);else assert.throws(()=>solve('+2'),/Invalid expression/);for(const text of ['', '1 2','1 +','(1','1)','1a','1 / 0'])assert.throws(()=>solve(text),/Invalid expression/);
};
