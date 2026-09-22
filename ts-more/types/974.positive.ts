import {solve, Decode} from '../solutions/974';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const input:unknown={}; const result=solve(input); if(result.ok){const n:number=result.value;void n;} else {const error:'not-number'|'not-finite'=result.error;void error;} solve(Symbol());
