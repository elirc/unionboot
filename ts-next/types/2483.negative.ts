import * as api from '../solutions/2483';
import {solve} from '../solutions/2483';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve().build(); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve().set("name",42); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve().set('missing',1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve().set("name","Ada").set("active",true).set("name","Ada"); }
