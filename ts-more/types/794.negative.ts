import {solve} from '../solutions/794';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([1,2], (x: string) => x.length > 0); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve(3, () => true); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const wrong: string[] = solve([1], () => true)[0]; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve([1], () => 'yes'); }
