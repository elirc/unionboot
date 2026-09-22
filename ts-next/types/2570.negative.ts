import * as api from '../solutions/2570';
import {solve} from '../solutions/2570';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"count":3},count:"bad"}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"count":3}).auditCount(1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"count":3}).auditCount(); }
