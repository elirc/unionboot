import * as api from '../solutions/2537';
import {solve} from '../solutions/2537';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const bad:api.Cell<Partial<api.Model>>=solve({"count":3,"active":true,"tags":["a","b"]}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"count":3,"active":true,"tags":["a","b"]}).set({}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"count":3,"active":true,"tags":["a","b"]},count:"bad"}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve({"count":3,"active":true,"tags":["a","b"]}).get(); }
