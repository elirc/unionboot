import * as api from '../solutions/2244';
import {solve} from '../solutions/2244';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r:number=solve("111111");type Good=Assert<Equal<api.Valid<"111111">,true>>;type Short=Assert<Equal<api.Valid<"11111">,false>>;void r;
