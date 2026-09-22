import * as api from '../solutions/2225';
import {solve} from '../solutions/2225';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r:string=solve({"v1":"a b1","v2":"a b2"});type Keys=Assert<Equal<keyof api.Input,"v1"|"v2">>;void r;
