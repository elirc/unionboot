import * as api from '../solutions/2518';
import {solve} from '../solutions/2518';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const broad:api.Consumer<Partial<api.Model>>={accept:value=>{void value;}};const narrow:api.Consumer<api.Model>=broad;const out=solve(broad);out.accept({"count":3,"tags":["a","b"]});void narrow;
