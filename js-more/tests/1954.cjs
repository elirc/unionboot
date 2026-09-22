// 1954 Elementary cellular automata / scenario 6 — rule=90; wrap=true
// Prompt: ../prompts/1954.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"rule":90,"wrap":true};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(cells,steps){const history=[[...cells]];for(let step=0;step<steps;step++){const prior=history.at(-1),next=[];for(let i=0;i<prior.length;i++){const triple=[i-1,i,i+1].map(j=>cfg.wrap?prior[(j+prior.length)%prior.length]:(prior[j]||0));const bit=parseInt(triple.join(''),2);next.push(Math.floor(cfg.rule/(2**bit))%2);}history.push(next);}return history;}for(const cells of [[],[0],[1],[1,0,1],[0,0,1,0,0],[1,1,0,0,1,0,1]])for(const steps of [0,1,4])check({cells,steps},oracle(cells,steps));assert.throws(()=>solve({cells:[],steps:-1}),/Steps/);
};
