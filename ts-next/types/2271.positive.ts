import * as api from '../solutions/2271';
import {solve} from '../solutions/2271';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","count":3});const value:string=r.getName();type Keys=Assert<Equal<keyof typeof r,"getName"|"getCount">>;void value;
