import {solve} from '../solutions/1155';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const run=solve((n:number)=>String(n),(s:string)=>s.length);const out:number=run(1);const other:(s:string)=>boolean=solve((s:string)=>s.length,n=>n>0);void out;void other;
