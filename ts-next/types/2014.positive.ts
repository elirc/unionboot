import * as api from '../solutions/2014';
import {solve} from '../solutions/2014';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve([],false);const exact:readonly [false]=r;const long=solve([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],null);const length:17=long.length;void exact;void length;
