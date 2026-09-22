import * as api from '../solutions/2528';
import {solve} from '../solutions/2528';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:api.Cell<Partial<api.Model>>=solve({"name":"Ada","active":true}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"name":"Ada","active":true}).set({}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"name":"Ada","active":true},name:42}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve({"name":"Ada","active":true}).get(); }
