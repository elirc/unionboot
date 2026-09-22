import {solve} from '../solutions/1046';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({id:1},['missing']); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const r=solve({id:1,name:'A'},['id']);r.name; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const r=solve({id:1},['id']);const bad:string=r.id; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve({id:1} as const,['id']);r.id=2; }
