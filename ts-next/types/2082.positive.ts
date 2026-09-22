import * as api from '../solutions/2082';
import {solve} from '../solutions/2082';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve([1,2,3,4,5,6,7,8,9]); const expected:api.Output=r; type Precise=Assert<Equal<typeof r,api.Output>>; void expected;
