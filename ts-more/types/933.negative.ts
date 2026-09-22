import {solve, Result} from '../solutions/933';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({ok:true,value:1}, (x:string)=>x); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({ok:'yes',value:1}, x=>x); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({ok:false}, x=>x); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve({ok:true,value:1},String); if(r.ok) {const bad:number=r.value;} }
