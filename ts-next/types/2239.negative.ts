import * as api from '../solutions/2239';
import {solve} from '../solutions/2239';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve("10"); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve("2"); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const s:string="1";solve(s); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve("1"); }
