import * as api from '../solutions/2449';
import {solve} from '../solutions/2449';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
declare const input:api.Input;const result:Promise<{next:number}>=solve(input);async function check(){const r=await solve(input);const leaf:number=r.next;void leaf;}void result;void check;
