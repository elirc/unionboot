import * as api from '../solutions/2243';
import {solve} from '../solutions/2243';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve("111110"); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve("21111"); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const s:string="11111";solve(s); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve("11111"); }
