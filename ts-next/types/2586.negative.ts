import * as api from '../solutions/2586';
import {solve} from '../solutions/2586';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve()('1'); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve()([2,3]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const input:number|api.Batch=Math.random()?1:[1,2,3];solve()(input); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve()(1); }
