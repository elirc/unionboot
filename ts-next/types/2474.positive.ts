import * as api from '../solutions/2474';
import {solve} from '../solutions/2474';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const next:'s1'=solve('s0','advance');const last:"s11"=solve("s10",'advance');void next;void last;
