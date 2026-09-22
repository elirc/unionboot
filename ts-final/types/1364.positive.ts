import {solve} from '../solutions/1364';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const run:(n:number)=>string=solve((n:number)=>String(n));const out:string=run(1);const id=solve((x:{id:number})=>x.id);const n:number=id({id:1});void out;void n;
