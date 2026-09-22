import * as api from '../solutions/2295';
import {solve} from '../solutions/2295';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"active":true,"tags":["a","b"]});r.setActive(true);r.setTags(["a","b"]);type Keys=Assert<Equal<keyof typeof r,"setActive"|"setTags">>;
