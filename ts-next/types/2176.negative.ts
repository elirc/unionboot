import * as api from '../solutions/2176';
import {solve} from '../solutions/2176';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(null); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:"/////////////////docs"=solve("/////////////////docs"); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:number=solve('/a'); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve('a',1); }
