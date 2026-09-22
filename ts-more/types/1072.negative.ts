import {solve, StringMap} from '../solutions/1072';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const r=solve({a:1},String);r.missing; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const r=solve({a:1},String);const bad:number=r.a; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({a:1},(value:string)=>value); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve(null,String); }
