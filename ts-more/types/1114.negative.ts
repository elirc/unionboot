import {solve} from '../solutions/1114';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([], (a:number,b:number)=>a-b); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const xs:number[]=[1];solve(xs,(a,b)=>a-b); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve([1],(a:string,b:string)=>a.localeCompare(b)); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const bad:undefined=solve([1],(a,b)=>a-b); }
