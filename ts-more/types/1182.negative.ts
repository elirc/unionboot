import {solve} from '../solutions/1182';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([1,2]); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad:string[]=solve([[1]]); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const bad:number[]=solve([[[1,2]]]); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve(null); }
