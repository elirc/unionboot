import * as api from '../solutions/2622';
import {solve} from '../solutions/2622';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({name:"Ada",tags:["a","b"]}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r=null as unknown as api.Output;r.name.value; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r=null as unknown as api.Output;if(r.name.status==='rejected')r.name.reason.message; }
