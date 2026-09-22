import {solve, Tree} from '../solutions/960';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({value:1},String); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({value:1,children:[]},(x:string)=>x); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const bad:Tree<number>=solve({value:1,children:[]},String); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const out=solve({value:1,children:[]},String); out.children.push({value:'x',children:[]}); }
