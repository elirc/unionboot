import * as api from '../solutions/2340';
import {solve} from '../solutions/2340';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"active":true,"tags":["a","b"]});for(const entry of r){if(entry[0]==="active"){const value:boolean=entry[1];void value;}}const pair:api.Entry<api.Input>=["active",true];void pair;
