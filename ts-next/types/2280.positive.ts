import * as api from '../solutions/2280';
import {solve} from '../solutions/2280';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"active":true,"tags":["a","b"]});const value:boolean=r.getActive();type Keys=Assert<Equal<keyof typeof r,"getActive"|"getTags">>;void value;
