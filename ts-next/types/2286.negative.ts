import * as api from '../solutions/2286';
import {solve} from '../solutions/2286';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"name":"Ada","count":3}).setName(42); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"name":"Ada","count":3}).missing(1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"name":"Ada","count":3}).setName(); }
