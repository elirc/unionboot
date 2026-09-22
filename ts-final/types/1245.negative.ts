import {solve} from '../solutions/1245';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([1],(s:string)=>s); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad:Promise<string[]>=solve([1],n=>n); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve(null,x=>x); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const bad:number[]=solve([1],n=>n); }
