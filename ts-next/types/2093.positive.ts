import * as api from '../solutions/2093';
import {solve} from '../solutions/2093';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve([1,"v1",true,4,"v4"]);const exact:readonly [string, number, boolean, string, number]=r;type Precise=Assert<Equal<typeof r,api.Output>>;void exact;
