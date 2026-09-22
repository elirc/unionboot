import {solve} from '../solutions/238';
const good=solve([1,2] as const,'10-4');void good;
// @ts-expect-error policy token must match this scenario
solve([], 'wrong-policy');
// @ts-expect-error input must be an array (or documented null), not a number
solve(42, '10-4');

