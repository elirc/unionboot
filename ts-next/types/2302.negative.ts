import * as api from '../solutions/2302';
import {solve} from '../solutions/2302';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:api.Present<api.Input>={active:undefined}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:api.Present<api.Input>={active:null}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:boolean=solve({"active":true}).active; }
