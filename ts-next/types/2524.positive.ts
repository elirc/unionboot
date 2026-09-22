import * as api from '../solutions/2524';
import {solve} from '../solutions/2524';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const cell:api.Cell<api.Model>=solve({"name":"Ada"});cell.set({"name":"Ada"});const value:string=cell.get().name;void value;
