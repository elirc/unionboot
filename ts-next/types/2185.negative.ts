import * as api from '../solutions/2185';
import {solve} from '../solutions/2185';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:"                 x "=solve("                 x "); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:number=solve(' x'); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve('x',true); }
