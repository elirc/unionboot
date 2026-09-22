import {solve} from '../solutions/1057';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const r=solve({id:1,name:'A'},'id',2); const n:number=r.id; const s:string=r.name; const optional:{name?:string}={};solve(optional,'name','present');void n;void s;
