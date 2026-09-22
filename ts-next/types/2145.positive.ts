import * as api from '../solutions/2145';
import {solve} from '../solutions/2145';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const args:api.Args<api.Format>=["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false];const text:string=solve(...args);type Positions=Assert<Equal<api.Args<api.Format>,[string, number, boolean, string, number, boolean, string, number, boolean, string, number, boolean]>>;void text;
