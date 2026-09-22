import * as api from '../solutions/2197';
import {solve} from '../solutions/2197';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:"a-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b"=solve("a-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b"); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:number=solve('a-b'); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve('x',false); }
