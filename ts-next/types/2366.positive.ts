import * as api from '../solutions/2366';
import {solve} from '../solutions/2366';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
declare const authority:api.Permit<api.Needed>;const plan=solve(authority);const keys:readonly api.Needed[]=plan.allowed;declare const stronger:api.Permit<api.Needed|'extra'>;void stronger;void keys;
