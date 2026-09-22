import * as api from '../solutions/2527';
import {solve} from '../solutions/2527';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const cell:api.Cell<api.Model>=solve({"active":true});cell.set({"active":true});const value:boolean=cell.get().active;void value;
