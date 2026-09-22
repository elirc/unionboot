import * as api from '../solutions/2311';
import {solve} from '../solutions/2311';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:api.Present<api.Input>={name:undefined}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:api.Present<api.Input>={name:null}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve({"name":"Ada","active":true,"tags":["a","b"]}).name; }
