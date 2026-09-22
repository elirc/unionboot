import * as api from '../solutions/2290';
import {solve} from '../solutions/2290';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","count":3,"active":true});r.setName("Ada");r.setCount(3);r.setActive(true);type Keys=Assert<Equal<keyof typeof r,"setName"|"setCount"|"setActive">>;
