import * as api from '../solutions/2272';
import {solve} from '../solutions/2272';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"active":true},active:0}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"active":true}).missing(); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"active":true}).getActive(1); }
