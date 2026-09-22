import * as api from '../solutions/2686';
import {solve} from '../solutions/2686';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const value:string=solve({"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7","name8":"N8","name9":"N9","name10":"N10","name11":"N11","name12":"N12","name13":"N13"});type Keys=Assert<Equal<keyof api.Args,"name1"|"name2"|"name3"|"name4"|"name5"|"name6"|"name7"|"name8"|"name9"|"name10"|"name11"|"name12"|"name13">>;void value;
