import * as api from '../solutions/2333';
import {solve} from '../solutions/2333';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"name":"Ada","active":true});for(const entry of r){if(entry[0]==="name"){const value:string=entry[1];void value;}}const pair:api.Entry<api.Input>=["name","Ada"];void pair;
