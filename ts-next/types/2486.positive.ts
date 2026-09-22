import * as api from '../solutions/2486';
import {solve} from '../solutions/2486';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const done=solve().set("tags",["a","b"]);const result:api.Model=done.build();const value:readonly string[]=result.tags;void value;
