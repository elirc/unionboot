import * as api from '../solutions/2411';
import {solve} from '../solutions/2411';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const s:string=solve({tags:["a","b"]});const tags:api.Options={tags:["a","b"]};void tags;void s;
