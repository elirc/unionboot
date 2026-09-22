import {solve, State, Action} from '../solutions/1031';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const s:State=solve({value:1,history:[]},{type:'add',amount:2});const value:number=s.value;void value;
