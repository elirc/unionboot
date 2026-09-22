import * as api from '../solutions/2633';
import {solve} from '../solutions/2633';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r:Promise<api.Outcome<number>>=solve(attempt=>{const a:api.Attempt=attempt;void a;return 1;});async function check(){const out=await r;if(!out.ok){const total:5=out.attempts;void total;}}void check;
