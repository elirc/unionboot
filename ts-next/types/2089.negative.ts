import * as api from '../solutions/2089';
import {solve} from '../solutions/2089';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([null]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1])[0]=1; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve([1]); }
