// 1817 JSON wildcard selection / scenario 9 — order=reverse; missing=skip; output=first
// Prompt: ../prompts/1817.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"order":"reverse","missing":"skip","output":"first"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(value,tokens){if(!tokens.length)return [value];const [token,...rest]=tokens;let children=[];if(token==='*'){if(value&&typeof value==='object'){let entries=Object.entries(value);if(cfg.order==='reverse')entries.reverse();children=entries.map(x=>x[1]);}}else if(value&&typeof value==='object'&&Object.hasOwn(value,token))children=[value[token]];else if(cfg.missing==='error')throw Error('Missing path');else if(cfg.missing==='null')children=[null];return children.flatMap(x=>oracle(x,rest));}
 const value={users:[{name:'A',score:0},{name:'B'},{name:'C',score:4}],empty:[],n:null};for(const route of [[],['users','*','name'],['users','*','score'],['n','x'],['missing'],['empty','*'],['toString']]){let expected;try{expected=oracle(value,route);}catch{assert.throws(()=>solve({value,path:route}),/Missing path/);continue;}check({value,path:route},cfg.output==='all'?expected:expected[0]??null);}
};
