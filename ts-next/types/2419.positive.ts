import * as api from '../solutions/2419';
import {solve} from '../solutions/2419';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"next":{"leaf":7}});r.next.leaf=8;const value:number=r.next.leaf;type Boundary=Assert<Equal<api.Deep<{next:{leaf:number}}>,{readonly next:{leaf:number}}>>;void value;
