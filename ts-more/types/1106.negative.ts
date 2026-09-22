import {solve} from '../solutions/1106';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const r=solve({id:1});r.id=2; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const r=solve({id:1});r.other=2; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve(null); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve({id:1});const bad:string=r.id; }
