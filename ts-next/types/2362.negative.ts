import * as api from '../solutions/2362';
import {solve} from '../solutions/2362';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({capabilities:{"active":true}}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const wrong=null as unknown as api.Permit<'other'>;solve(wrong); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const p=null as unknown as api.Plan;p.allowed.push("active"); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const p=null as unknown as api.Plan;const bad:number=p.allowed[0]; }
