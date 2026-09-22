import * as api from '../solutions/2311';
import {solve} from '../solutions/2311';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","active":true,"tags":["a","b"]});const maybe:string|undefined=r.name;const empty:api.Present<api.Input>={};void maybe;void empty;
