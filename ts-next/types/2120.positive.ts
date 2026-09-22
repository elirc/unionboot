import * as api from '../solutions/2120';
import {solve} from '../solutions/2120';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const p:api.Input={"p1":"v 1","p2":"v 2"};const text:string=solve(p);type Keys=Assert<Equal<keyof api.Input,"p1"|"p2">>;void text;
