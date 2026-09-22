import * as api from '../solutions/2527';
import {solve} from '../solutions/2527';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:api.Cell<Partial<api.Model>>=solve({"active":true}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"active":true}).set({}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"active":true},active:0}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve({"active":true}).get(); }
