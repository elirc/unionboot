import {solve} from '../solutions/229';
const preserved=solve(['a','b'] as const,'9-0'); void preserved;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '9-0');

