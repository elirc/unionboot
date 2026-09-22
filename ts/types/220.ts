import {solve} from '../solutions/220';
const preserved=solve(['a','b'] as const,'7-1'); void preserved;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '7-1');

