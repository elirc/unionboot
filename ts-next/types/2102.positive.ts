import * as api from '../solutions/2102';
import {solve} from '../solutions/2102';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve([1,"v1",true,4,"v4",false,7,"v7",true,10,"v10",false,13,"v13"]);const exact:readonly [string, number, boolean, string, number, boolean, string, number, boolean, string, number, boolean, string, number]=r;type Precise=Assert<Equal<typeof r,api.Output>>;void exact;
