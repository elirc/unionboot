import * as api from '../solutions/2330';
import {solve} from '../solutions/2330';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"count":3});for(const entry of r){if(entry[0]==="count"){const value:number=entry[1];void value;}}const pair:api.Entry<api.Input>=["count",3];void pair;
