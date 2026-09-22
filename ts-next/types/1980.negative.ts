import * as api from '../solutions/1980';
import {solve} from '../solutions/1980';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:string=solve({"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":7}}}}}}}}}}}}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:number=solve({"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":7}}}}}}}}}}}}}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":{"value":7}}}}}}}}}}}}).missing; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:api.Peel<{ value: { value: { value: { value: { value: { value: { value: { value: { value: { value: { value: { value: boolean } } } } } } } } } } } }>=1; }
