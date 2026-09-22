import * as api from '../solutions/2680';
import {solve} from '../solutions/2680';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7"},name1:1}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({...{"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7"},unknown:'x'}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7"}); }
