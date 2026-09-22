// 1775 Dijkstra route policies / scenario 7 — toll=3; tie=lexical
// Prompt: ../prompts/1775.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"toll":3,"tie":"lexical"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check({nodes:['a'],edges:[],start:'a'},[{node:'a',cost:0,path:['a']}]);
 function oracle(input){const routes=new Map();function visit(at,cost,route){const prev=routes.get(at),lex=prev&&JSON.stringify(route)<JSON.stringify(prev.path);if(!prev||cost<prev.cost||(cost===prev.cost&&(cfg.tie==='fewest'&&route.length!==prev.path.length?route.length<prev.path.length:lex)))routes.set(at,{cost,path:route});for(const [a,b,w] of input.edges)if(a===at&&!route.includes(b))visit(b,cost+w+cfg.toll,[...route,b]);}visit(input.start,0,[input.start]);return input.nodes.map(node=>({node,...(routes.get(node)||{cost:null,path:[]})}));}
 for(let w=1;w<=10;w++){const input={nodes:['s','a','b','t','z'],start:'s',edges:[['s','a',1],['a','b',1],['b','t',1],['s','t',w],['a','t',w],['t','s',2]]};check(input,oracle(input));}
};
