import * as api from '../solutions/2405';
import {solve} from '../solutions/2405';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({count:"bad"}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({count:undefined}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({count:3,name:undefined}); }
