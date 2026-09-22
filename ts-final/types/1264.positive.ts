import {solve, Events} from '../solutions/1264';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
solve('saved',{id:'a'},(event,payload)=>{const e:'saved'=event;const id:string=payload.id;void e;void id;});solve('closed',undefined,()=>{});solve('progress',{completed:1,total:2},(_,p)=>{const n:number=p.total;void n;});
