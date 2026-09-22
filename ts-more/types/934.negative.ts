import {solve, Result} from '../solutions/934';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([{ok:true}]); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve([{ok:false,value:1}]); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const r=solve<number,string>([{ok:true,value:1}]); const bad:string[]=r.values; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve<number,string>([{ok:false,error:42}]); }
