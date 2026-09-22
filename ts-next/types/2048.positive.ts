import * as api from '../solutions/2048';
import {solve} from '../solutions/2048';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve('x');const exact:readonly ['x', 'x', 'x', 'x', 'x']=r;const len:5=r.length;const obj=solve({enabled:true});const yes:true=obj[0].enabled;void exact;void len;void yes;
