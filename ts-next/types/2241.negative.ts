import * as api from '../solutions/2241';
import {solve} from '../solutions/2241';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve("1110"); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve("211"); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const s:string="111";solve(s); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve("111"); }
