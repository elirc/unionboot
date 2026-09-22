import * as api from '../solutions/2480';
import {solve} from '../solutions/2480';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const done=solve().set("count",3);const result:api.Model=done.build();const value:number=result.count;void value;
