import * as api from '../solutions/2021';
import {solve} from '../solutions/2021';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(1,0); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([],0).push(0); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:string=solve([],0)[0]; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve([],0,1); }
