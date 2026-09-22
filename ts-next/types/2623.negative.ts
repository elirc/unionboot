import * as api from '../solutions/2623';
import {solve} from '../solutions/2623';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({count:3,tags:["a","b"]}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r=null as unknown as api.Output;r.count.value; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r=null as unknown as api.Output;if(r.count.status==='rejected')r.count.reason.message; }
