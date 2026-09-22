import {solve, UserId, Decode} from '../solutions/1317';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const id:UserId='usr_1'; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const r=solve('usr_1');r.value; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const r=solve('usr_1');if(r.ok){const bad:number=r.value;} }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ function consume(id:UserId){} consume('usr_1'); }
