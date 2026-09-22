import {solve, Events} from '../solutions/1267';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve('saved',{completed:1,total:2},()=>{}); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve('missing',undefined,()=>{}); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve('closed',{},()=>{}); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve('progress',{completed:1},()=>{}); }
