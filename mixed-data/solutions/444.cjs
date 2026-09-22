// 444: Report policy 61: any, min 0, groups
// Filter records by amount >=0, status any; sort amount ascending, ties id ascending (code-unit). Skip 0, take 3. Return [team,totalAmount] pairs sorted by team, grouping only selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=444 [--starters]
// Study tests/444.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=0).map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,3);const groups={};for(const r of selected)groups[r.team]=(groups[r.team]??0)+r.amount;return Object.entries(groups).sort(([a],[b])=>a<b?-1:a>b?1:0);
}
module.exports=solve;
