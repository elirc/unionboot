import {solve} from '../solutions/1247';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const a:Promise<string[]>=solve([1,2],async n=>String(n));const b:Promise<number[]>=solve(['a'],s=>s.length);void a;void b;
