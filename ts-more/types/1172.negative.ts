import {solve} from '../solutions/1172';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve<number>(null,'1'); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve<boolean>(undefined,0); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const bad:string=solve<number>(null,1); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve<{id:number}>(null,{}); }
