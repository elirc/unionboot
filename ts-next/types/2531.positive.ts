import * as api from '../solutions/2531';
import {solve} from '../solutions/2531';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const cell:api.Cell<api.Model>=solve({"tags":["a","b"]});cell.set({"tags":["a","b"]});const value:readonly string[]=cell.get().tags;void value;
