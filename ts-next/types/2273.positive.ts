import * as api from '../solutions/2273';
import {solve} from '../solutions/2273';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","active":true});const value:string=r.getName();type Keys=Assert<Equal<keyof typeof r,"getName"|"getActive">>;void value;
