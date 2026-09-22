import * as api from '../solutions/2278';
import {solve} from '../solutions/2278';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"count":3,"tags":["a","b"]});const value:number=r.getCount();type Keys=Assert<Equal<keyof typeof r,"getCount"|"getTags">>;void value;
