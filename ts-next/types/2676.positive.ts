import * as api from '../solutions/2676';
import {solve} from '../solutions/2676';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const value:string=solve({"name1":"N1","name2":"N2","name3":"N3"});type Keys=Assert<Equal<keyof api.Args,"name1"|"name2"|"name3">>;void value;
