import * as api from '../solutions/2475';
import {solve} from '../solutions/2475';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const next:'s1'=solve('s0','advance');const last:"s12"=solve("s11",'advance');void next;void last;
