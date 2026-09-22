import * as api from '../solutions/2471';
import {solve} from '../solutions/2471';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const next:'s1'=solve('s0','advance');const last:"s8"=solve("s7",'advance');void next;void last;
