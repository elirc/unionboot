import * as api from '../solutions/2641';
import {solve} from '../solutions/2641';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:api.Attempt=14; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve(1); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:Promise<api.Outcome<string>>=solve(()=>1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r=null as unknown as api.Outcome<number>;if(!r.ok)r.error.message; }
