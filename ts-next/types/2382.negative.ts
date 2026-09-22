import * as api from '../solutions/2382';
import {solve} from '../solutions/2382';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const h:api.Handlers={}; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const m:api.Message={kind:"name",value:42}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const m:api.Message={kind:'missing',value:1}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const h:api.Handlers={name:()=>1,tags:()=>1}; }
