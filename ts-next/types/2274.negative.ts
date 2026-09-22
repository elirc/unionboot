import * as api from '../solutions/2274';
import {solve} from '../solutions/2274';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"count":3,"active":true},count:"bad"}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"count":3,"active":true}).missing(); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"count":3,"active":true}).getCount(1); }
