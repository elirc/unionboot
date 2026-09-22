import * as api from '../solutions/2163';
import {solve} from '../solutions/2163';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve('a').push('b'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:number=solve('a')[0]; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:readonly ['a','b']=solve('a'); }
