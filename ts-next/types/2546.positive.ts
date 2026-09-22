import * as api from '../solutions/2546';
import {solve} from '../solutions/2546';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const fn:api.Method=solve();const s:string=fn.call({"tags":["a","b"]},'>');const bound:(prefix:string)=>string=fn.bind({"tags":["a","b"]});bound('x');void s;
