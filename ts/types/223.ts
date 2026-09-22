import {solve} from '../solutions/223';
const preserved=solve(['a','b'] as const,'7-4'); void preserved;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '7-4');

