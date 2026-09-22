import * as api from '../solutions/2325';
import {solve} from '../solutions/2325';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({});const value:boolean=r.active;r.active=true;type RequiredKeys=Assert<Equal<Required<api.Output>,api.Output>>;void value;
