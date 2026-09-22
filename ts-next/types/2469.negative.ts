import * as api from '../solutions/2469';
import {solve} from '../solutions/2469';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve("s6",'advance'); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve('s0','reset'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:'s0'=solve('s0','advance'); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve('s0'); }
