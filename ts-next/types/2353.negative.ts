import * as api from '../solutions/2353';
import {solve} from '../solutions/2353';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:api.Descriptor={kind:'date'}; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:api.Output={}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r=solve({});r.missing; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:api.Output={...{"count":3,"tags":["a","b"]},count:"bad"}; }
