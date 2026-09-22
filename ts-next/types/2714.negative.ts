import * as api from '../solutions/2714';
import {solve} from '../solutions/2714';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([2,3,4,5,6,7,8,9,10,11,12],1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([1,2,3,4,5,6,7,8,9,10,11,12],'1'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1,2,3,4,5,6,7,8,9,10,11,12],1).degree=11; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:12=solve([1,2,3,4,5,6,7,8,9,10,11,12],1).degree; }
