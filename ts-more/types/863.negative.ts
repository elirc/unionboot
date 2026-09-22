import {solve} from '../solutions/863';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const bad: Map<string,number[]> = solve([1],x=>x); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad: Map<number,string[]> = solve([1],x=>x); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve([1], (x: string) => x); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve({}, x=>x); }
