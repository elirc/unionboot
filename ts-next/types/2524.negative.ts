import * as api from '../solutions/2524';
import {solve} from '../solutions/2524';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:api.Cell<Partial<api.Model>>=solve({"name":"Ada"}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"name":"Ada"}).set({}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"name":"Ada"},name:42}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve({"name":"Ada"}).get(); }
