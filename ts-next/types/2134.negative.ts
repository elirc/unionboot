import * as api from '../solutions/2134';
import {solve} from '../solutions/2134';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(...[]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve(null); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve(...["item0"],'extra'); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve(...["item0"]); }
