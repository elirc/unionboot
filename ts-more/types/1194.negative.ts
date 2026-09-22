import {solve} from '../solutions/1194';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve(1); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad:Map<string,number>=solve([1]); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const bad:Map<number,string>=solve([1]); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const counts=solve(['a'] as const);counts.get('b'); }
