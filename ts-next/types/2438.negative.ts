import * as api from '../solutions/2438';
import {solve} from '../solutions/2438';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({next:undefined}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({"next":{"next":{"next":{"next":{"next":{}}}}}}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({"next":{"next":{"next":{"next":{"next":{"leaf":"bad"}}}}}}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve({}).next.next.next.next.next.leaf; }
