import * as api from '../solutions/2375';
import {solve} from '../solutions/2375';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const handlers:api.Handlers={count:(value:number)=>String(value)};const s:string=solve({kind:"count",value:3},handlers);void s;
