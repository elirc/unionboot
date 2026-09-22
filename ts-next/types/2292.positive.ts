import * as api from '../solutions/2292';
import {solve} from '../solutions/2292';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","tags":["a","b"]});r.setName("Ada");r.setTags(["a","b"]);type Keys=Assert<Equal<keyof typeof r,"setName"|"setTags">>;
