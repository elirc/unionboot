import * as api from '../solutions/2230';
import {solve} from '../solutions/2230';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7"},v1:1}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7"},unknown:'x'}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7"}); }
