import {solve} from '../solutions/823';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const out: [number,string][] = solve([1],['x']); const literal: [1,true][] = solve([1] as const,[true] as const); void out; void literal;
