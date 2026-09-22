import {solve} from '../solutions/863';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const bySize: Map<number,string[]> = solve(['a'], x => x.length); const byObj: Map<{key:number},number[]> = solve([1], key => ({key})); void bySize; void byObj;
