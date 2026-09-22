// 142: Multiset subtract
// Input {a:number[],b:number[]} of integers. Return sorted multiset subtract. Multiplicities use max(aCount-bCount,0). Do not treat duplicates as a simple set.
// Tests: node js-rest/verify.cjs --id=142 [--starters]
// Study tests/142.cjs for examples.
function solve(input) {
const a=new Map(),b=new Map();for(const n of input.a)a.set(n,(a.get(n)||0)+1);for(const n of input.b)b.set(n,(b.get(n)||0)+1);const out=[];for(const n of [...new Set([...a.keys(),...b.keys()])].sort((x,y)=>x-y)){const x=a.get(n)||0,y=b.get(n)||0;out.push(...Array(Math.max(x-y,0)).fill(n));}return out;
}
module.exports=solve;
