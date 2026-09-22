import {solve} from '../solutions/891';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const xs: readonly (string|number)[] = [1,'x']; const out: string[] = solve(xs,(x): x is string => typeof x === 'string'); const nums: number[] = solve(xs,(x): x is number => typeof x === 'number'); void out; void nums;
