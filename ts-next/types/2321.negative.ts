import * as api from '../solutions/2321';
import {solve} from '../solutions/2321';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({tags:undefined}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({tags:42}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:api.Output={}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({missing:1}); }
