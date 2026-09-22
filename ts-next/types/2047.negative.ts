import * as api from '../solutions/2047';
import {solve} from '../solutions/2047';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve('x')[0]='x'; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:number=solve('x')[0]; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve(1)[4]; }
