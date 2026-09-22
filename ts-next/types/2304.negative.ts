import * as api from '../solutions/2304';
import {solve} from '../solutions/2304';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:api.Present<api.Input>={count:undefined}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:api.Present<api.Input>={count:null}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"count":3,"active":true}).count; }
