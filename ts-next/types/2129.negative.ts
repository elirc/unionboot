import * as api from '../solutions/2129';
import {solve} from '../solutions/2129';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4","p5":"v 5","p6":"v 6","p7":"v 7","p8":"v 8","p9":"v 9","p10":"v 10","p11":"v 11"},p1:1}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4","p5":"v 5","p6":"v 6","p7":"v 7","p8":"v 8","p9":"v 9","p10":"v 10","p11":"v 11"},unknown:'x'}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4","p5":"v 5","p6":"v 6","p7":"v 7","p8":"v 8","p9":"v 9","p10":"v 10","p11":"v 11"}); }
