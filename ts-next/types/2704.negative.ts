import * as api from '../solutions/2704';
import {solve} from '../solutions/2704';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([2],1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([1,2],'1'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1,2],1).degree=1; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:2=solve([1,2],1).degree; }
