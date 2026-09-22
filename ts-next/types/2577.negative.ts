import * as api from '../solutions/2577';
import {solve} from '../solutions/2577';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({...{"name":"Ada","tags":["a","b"]},name:42}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"name":"Ada","tags":["a","b"]}).auditName(1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({"name":"Ada","tags":["a","b"]}).auditName(); }
