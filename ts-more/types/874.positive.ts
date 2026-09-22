import {solve} from '../solutions/874';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const values: number[] = solve([1,null,undefined]); const falsy: (0|false|'')[] = solve([0,false,'',null] as const); const empty: never[] = solve([null,undefined]); void values; void falsy; void empty;
