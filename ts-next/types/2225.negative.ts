import * as api from '../solutions/2225';
import {solve} from '../solutions/2225';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"v1":"a b1","v2":"a b2"},v1:1}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"v1":"a b1","v2":"a b2"},unknown:'x'}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"v1":"a b1","v2":"a b2"}); }
