import {solve} from '../solutions/271';
const preserved=solve(['a','b'] as const,'17-2'); void preserved;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '17-2');

