import * as api from '../solutions/2326';
import {solve} from '../solutions/2326';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({name:undefined}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({name:42}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:api.Output={}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({missing:1}); }
