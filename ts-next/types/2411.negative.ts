import * as api from '../solutions/2411';
import {solve} from '../solutions/2411';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({tags:42}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({tags:undefined}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({tags:["a","b"],name:undefined}); }
