import * as api from '../solutions/2621';
import {solve} from '../solutions/2621';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({tags:["a","b"]}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r=null as unknown as api.Output;r.tags.value; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r=null as unknown as api.Output;if(r.tags.status==='rejected')r.tags.reason.message; }
