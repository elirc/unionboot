import {solve} from '../solutions/1210';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const n:number=solve((a:number,b:string)=>a+b.length,1,'x');const s:string=solve(()=> 'x');solve((a:number,b?:string)=>a,1);void n;void s;
