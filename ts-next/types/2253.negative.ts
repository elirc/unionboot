import * as api from '../solutions/2253';
import {solve} from '../solutions/2253';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve("1111111111111110"); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve("211111111111111"); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const s:string="111111111111111";solve(s); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve("111111111111111"); }
