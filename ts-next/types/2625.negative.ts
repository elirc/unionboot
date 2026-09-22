import * as api from '../solutions/2625';
import {solve} from '../solutions/2625';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({active:true,tags:["a","b"]}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r=null as unknown as api.Output;r.active.value; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r=null as unknown as api.Output;if(r.active.status==='rejected')r.active.reason.message; }
