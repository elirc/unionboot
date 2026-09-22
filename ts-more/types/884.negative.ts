import {solve} from '../solutions/884';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const bad: string[] = solve([1,null]); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad: null[] = solve([1,null]); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve(null); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const bad: number[] = solve(['x',undefined]); }
