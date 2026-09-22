import {solve} from '../solutions/227';
const preserved=solve(['a','b'] as const,'8-3'); void preserved;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '8-3');

