import {solve} from '../solutions/1160';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const n:number=solve<number>(null,1);const word:string=solve<string>('','fallback');const obj:{id:number}=solve<{id:number}>(undefined,{id:1});void n;void word;void obj;
