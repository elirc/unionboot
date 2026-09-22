import * as api from '../solutions/2300';
import {solve} from '../solutions/2300';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"count":3});const maybe:number|undefined=r.count;const empty:api.Present<api.Input>={};void maybe;void empty;
