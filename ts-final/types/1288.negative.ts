import {solve} from '../solutions/1288';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ type E={kind:'a';a:number}|{kind:'b';b:string};solve([] as E[],'c'); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const r=solve([{kind:'a' as const,a:1}],'a');r[0]!.b; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const r=solve([{kind:'a' as const,a:1}],'a');const bad:string=r[0]!.a; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve([1],'a'); }
