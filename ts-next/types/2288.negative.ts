import * as api from '../solutions/2288';
import {solve} from '../solutions/2288';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"name":"Ada","active":true}).setName(42); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"name":"Ada","active":true}).missing(1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"name":"Ada","active":true}).setName(); }
