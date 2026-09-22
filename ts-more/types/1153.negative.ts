import {solve} from '../solutions/1153';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve((n:number)=>String(n),(n:number)=>n+1); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const f=solve((n:number)=>String(n),s=>s.length);f('1'); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const f=solve((n:number)=>String(n),s=>s.length);const bad:string=f(1); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve(1,(n:number)=>n); }
