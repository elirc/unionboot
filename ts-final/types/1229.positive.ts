import {solve, Result} from '../solutions/1229';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const pending:Promise<Result<number>>=solve(async()=>1);const plain:Promise<Result<string>>=solve(()=> 'x');async function check(){const r=await solve(()=>1);if(r.ok){const n:number=r.value;void n;}else{const e:unknown=r.error;void e;}}void pending;void plain;void check;
