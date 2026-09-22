import * as api from '../solutions/2078';
import {solve} from '../solutions/2078';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([2,3,4,5]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve(["bad",2,3,4,5]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:string=solve([1,2,3,4,5]); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve(undefined); }
