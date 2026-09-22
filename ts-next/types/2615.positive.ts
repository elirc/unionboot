import * as api from '../solutions/2615';
import {solve} from '../solutions/2615';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
declare const input:api.Input;async function check(){const r=await solve(input);if(r.count.status==='fulfilled'){const value:number=r.count.value;void value;}else{const reason:unknown=r.count.reason;void reason;}}void check;
