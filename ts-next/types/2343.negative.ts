import * as api from '../solutions/2343';
import {solve} from '../solutions/2343';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const e:api.Entry<api.Input>=["name",42]; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const e:api.Entry<api.Input>=['missing',1]; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"name":"Ada","count":3,"active":true,"tags":["a","b"]}).push(["name","Ada"]); }
