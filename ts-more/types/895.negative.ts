import {solve} from '../solutions/895';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([1,'x'], (x): x is boolean => typeof x === 'boolean'); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad: number[] = solve([1,'x'],(x): x is string => typeof x === 'string'); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve([1], (x: string): x is string => true); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve(null, (x: unknown): x is string => typeof x === 'string'); }
