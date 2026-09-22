import * as api from '../solutions/2401';
import {solve} from '../solutions/2401';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","count":3,"active":true,"tags":["a","b"]});r.name="Ada";r.active=true;r.tags=["a","b"];const val:string=r.name;void val;
