// 1729 Ranked trie autocomplete / scenario 1 — rank=score; limit=2
// Prompt: ../prompts/1729.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"rank":"score","limit":2};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check({words:[],prefix:''},[]);const words=[{word:'apple',score:2},{word:'a',score:9},{word:'atom',score:4},{word:'apricot',score:8},{word:'ape',score:2},{word:'z',score:99},{word:'',score:7}];
 for(const prefix of ['','a','ap','apple','missing']){const expected=words.map((x,i)=>({...x,i})).filter(x=>x.word.startsWith(prefix));expected.sort((a,b)=>(cfg.rank==='score'?b.score-a.score:cfg.rank==='shortest'?a.word.length-b.word.length:cfg.rank==='longest'?b.word.length-a.word.length:cfg.rank==='recent'?b.i-a.i:0)||(a.word<b.word?-1:1));check({words,prefix},expected.slice(0,cfg.limit).map(x=>x.word));}
};
