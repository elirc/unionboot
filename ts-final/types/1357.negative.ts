import {solve} from '../solutions/1357';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const run=solve((n:number)=>String(n));run('1'); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const run=solve((n:number)=>String(n));const bad:number=run(1); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve(1); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const run=solve((x:{id:number})=>x.id);run({id:'1'}); }
