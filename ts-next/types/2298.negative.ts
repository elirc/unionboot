import * as api from '../solutions/2298';
import {solve} from '../solutions/2298';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"name":"Ada","count":3,"active":true,"tags":["a","b"]}).setName(42); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"name":"Ada","count":3,"active":true,"tags":["a","b"]}).missing(1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"name":"Ada","count":3,"active":true,"tags":["a","b"]}).setName(); }
