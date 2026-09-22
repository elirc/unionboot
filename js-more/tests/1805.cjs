// 1805 Huffman prefix codes / scenario 7 — tie=descending; output=table; zero=1
// Prompt: ../prompts/1805.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"tie":"descending","output":"table","zero":"1"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(text){const counts={};for(const ch of text)counts[ch]=(counts[ch]||0)+1;let nodes=Object.keys(counts).map(k=>({key:k,w:counts[k],codes:{[k]:''}}));while(nodes.length>1){nodes.sort((a,b)=>a.w-b.w||(a.key<b.key?(cfg.tie==='ascending'?-1:1):a.key>b.key?(cfg.tie==='ascending'?1:-1):0));const a=nodes.shift(),b=nodes.shift(),codes={};for(const k of Object.keys(a.codes))codes[k]=(cfg.zero||'0')+a.codes[k];for(const k of Object.keys(b.codes))codes[k]=(cfg.zero==='1'?'0':'1')+b.codes[k];nodes.push({key:Object.keys(codes).sort().join(''),w:a.w+b.w,codes});}const map=nodes[0]?.codes||{};for(const k of Object.keys(map))if(!map[k])map[k]=cfg.zero||'0';const codes=Object.keys(map).sort().map(k=>[k,map[k]]),bits=[...text].map(k=>map[k]).join('');return cfg.output==='table'?codes:cfg.output==='length'?(cfg.unit==='bytes'?Math.ceil(bits.length/8):bits.length):{codes,bits};}
 for(const text of ['', 'aaaa', 'ab', 'abcde', 'abbcccdddd', 'banana bandana'])check(text,oracle(text));
};
