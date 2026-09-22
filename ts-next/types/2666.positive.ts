import * as api from '../solutions/2666';
import {solve} from '../solutions/2666';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
declare const length:api.Quantity<api.LengthPower>;declare const time:api.Quantity<api.DurationPower>;const product:api.Product=solve(length,time);const n:number=product;void n;
