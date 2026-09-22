import * as api from '../solutions/2385';
import {solve} from '../solutions/2385';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const handlers:api.Handlers={active:(value:boolean)=>String(value),tags:(value:readonly string[])=>String(value)};const s:string=solve({kind:"active",value:true},handlers);void s;
