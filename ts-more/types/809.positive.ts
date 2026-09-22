import {solve} from '../solutions/809';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const out: ('a'|'b')[][] = solve(['a','b'] as const, 1); const other: boolean[][] = solve([true,false], 2); void out; void other;
