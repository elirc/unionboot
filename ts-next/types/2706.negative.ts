import * as api from '../solutions/2706';
import {solve} from '../solutions/2706';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([2,3,4],1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([1,2,3,4],'1'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1,2,3,4],1).degree=3; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:4=solve([1,2,3,4],1).degree; }
