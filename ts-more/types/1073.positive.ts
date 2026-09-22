import {solve, StringMap} from '../solutions/1073';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const r=solve({a:1,b:2},(value,key)=>key+value);const a:string=r.a;const b:string=r.b;void a;void b;
