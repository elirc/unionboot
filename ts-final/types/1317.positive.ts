import {solve, UserId, Decode} from '../solutions/1317';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const r=solve('usr_1');if(r.ok){const id:UserId=r.value;const text:string=id;void text;}function consume(id:UserId){return id;}void consume;
