import * as api from '../solutions/2231';
import {solve} from '../solutions/2231';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r:string=solve({"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7","v8":"a b8"});type Keys=Assert<Equal<keyof api.Input,"v1"|"v2"|"v3"|"v4"|"v5"|"v6"|"v7"|"v8">>;void r;
