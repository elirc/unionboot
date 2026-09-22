import * as api from '../solutions/2602';
import {solve} from '../solutions/2602';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([Promise.resolve(false),Promise.resolve("v1"),Promise.resolve(3),Promise.resolve("v3")]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r:api.Winner={index:4,value:1}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r:api.Winner={index:0,value:'bad'}; }
