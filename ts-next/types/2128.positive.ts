import * as api from '../solutions/2128';
import {solve} from '../solutions/2128';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const p:api.Input={"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4","p5":"v 5","p6":"v 6","p7":"v 7","p8":"v 8","p9":"v 9","p10":"v 10"};const text:string=solve(p);type Keys=Assert<Equal<keyof api.Input,"p1"|"p2"|"p3"|"p4"|"p5"|"p6"|"p7"|"p8"|"p9"|"p10">>;void text;
