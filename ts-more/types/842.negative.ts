import {solve} from '../solutions/842';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([{id:1}], 'missing'); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad: string[] = solve([{id:1}], 'id'); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const bad: number[] = solve([{}] as {x?:number}[], 'x'); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve(1, 'toString'); }
