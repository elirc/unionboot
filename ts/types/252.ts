import {solve} from '../solutions/252';
const good=solve([1,2] as const,'13-3');void good;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '13-3');

