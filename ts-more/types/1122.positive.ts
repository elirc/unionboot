import {solve} from '../solutions/1122';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const n:number=solve([1,2],(a,b)=>a-b);const literal:1|2=solve([1,2] as const,(a,b)=>a-b);const word:string=solve(['a'],(a,b)=>a.localeCompare(b));void n;void literal;void word;
