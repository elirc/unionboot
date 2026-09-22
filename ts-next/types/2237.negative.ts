import * as api from '../solutions/2237';
import {solve} from '../solutions/2237';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7","v8":"a b8","v9":"a b9","v10":"a b10","v11":"a b11","v12":"a b12","v13":"a b13","v14":"a b14"},v1:1}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7","v8":"a b8","v9":"a b9","v10":"a b10","v11":"a b11","v12":"a b12","v13":"a b13","v14":"a b14"},unknown:'x'}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7","v8":"a b8","v9":"a b9","v10":"a b10","v11":"a b11","v12":"a b12","v13":"a b13","v14":"a b14"}); }
