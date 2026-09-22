import * as api from '../solutions/2494';
import {solve} from '../solutions/2494';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const full:api.Producer<api.Model>={get:()=>({"name":"Ada"})};const partial:api.Producer<Partial<api.Model>>=full;const out=solve(full);const value:string|undefined=out.get().name;void partial;void value;
