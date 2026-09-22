// 143: Multiset symmetric
// Input {a:number[],b:number[]} of integers. Return sorted multiset symmetric. Multiplicities use absolute count difference. Do not treat duplicates as a simple set.
// Tests: node js-rest/verify.cjs --id=143 [--starters]
// Study tests/143.cjs for examples.
function solve(input) {
const a=new Map(),b=new Map();for(const n of input.a)a.set(n,(a.get(n)||0)+1);for(const n of input.b)b.set(n,(b.get(n)||0)+1);const out=[];for(const n of [...new Set([...a.keys(),...b.keys()])].sort((x,y)=>x-y)){const x=a.get(n)||0,y=b.get(n)||0;out.push(...Array(Math.abs(x-y)).fill(n));}return out;
}
module.exports=solve;
