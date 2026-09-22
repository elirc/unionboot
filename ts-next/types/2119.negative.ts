import * as api from '../solutions/2119';
import {solve} from '../solutions/2119';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"p1":"v 1"},p1:1}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"p1":"v 1"},unknown:'x'}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"p1":"v 1"}); }
