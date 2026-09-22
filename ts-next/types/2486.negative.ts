import * as api from '../solutions/2486';
import {solve} from '../solutions/2486';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve().build(); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve().set("tags",42); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve().set('missing',1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve().set("tags",["a","b"]).set("tags",["a","b"]); }
