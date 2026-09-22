import * as api from '../solutions/2482';
import {solve} from '../solutions/2482';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const done=solve().set("active",true);const result:api.Model=done.build();const value:boolean=result.active;void value;
