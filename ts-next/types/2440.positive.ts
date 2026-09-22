import * as api from '../solutions/2440';
import {solve} from '../solutions/2440';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r:api.Model=solve({});const patch:api.Patch<api.Model>={"next":{"next":{"next":{"next":{"next":{"next":{"next":{"leaf":7}}}}}}}};solve(patch);const value:number=r.next.next.next.next.next.next.next.leaf;void value;
