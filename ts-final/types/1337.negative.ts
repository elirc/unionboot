import {solve} from '../solutions/1337';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({user:{name:'a'}},['missing','name']); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({user:{name:'a'}},['user','age']); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const bad:number|undefined=solve({user:{name:'a'}},['user','name']); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve({user:{name:'a'}},['user']); }
