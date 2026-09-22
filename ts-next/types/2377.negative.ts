import * as api from '../solutions/2377';
import {solve} from '../solutions/2377';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const h:api.Handlers={}; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const m:api.Message={kind:"active",value:0}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const m:api.Message={kind:'missing',value:1}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const h:api.Handlers={active:()=>1}; }
