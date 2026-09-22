import * as api from '../solutions/2340';
import {solve} from '../solutions/2340';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const e:api.Entry<api.Input>=["active",0]; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const e:api.Entry<api.Input>=['missing',1]; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"active":true,"tags":["a","b"]}).push(["active",true]); }
