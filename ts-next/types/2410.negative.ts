import * as api from '../solutions/2410';
import {solve} from '../solutions/2410';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({name:42}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({name:undefined}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({name:"Ada",count:3}); }
