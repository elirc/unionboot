import {solve} from '../solutions/1185';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const n:number[]=solve([[1],[2]] as const);const lit:(1|2)[]=solve([[1],[2]] as const);const deeper:number[][]=solve([[[1,2]]]);void n;void lit;void deeper;
