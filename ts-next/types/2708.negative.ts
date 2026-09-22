import * as api from '../solutions/2708';
import {solve} from '../solutions/2708';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([2,3,4,5,6],1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([1,2,3,4,5,6],'1'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1,2,3,4,5,6],1).degree=5; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:6=solve([1,2,3,4,5,6],1).degree; }
