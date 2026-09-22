import * as api from '../solutions/2586';
import {solve} from '../solutions/2586';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const fn=solve();const scalar:string=fn(1);const batch:readonly [string, string, string]=fn([1,2,3]);void scalar;void batch;
