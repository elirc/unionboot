import * as api from '../solutions/2109';
import {solve} from '../solutions/2109';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(null,1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([],1).push(1); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:number=solve([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],'insert')[6]; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve([]); }
