import * as api from '../solutions/2608';
import {solve} from '../solutions/2608';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([Promise.resolve(false),Promise.resolve("v1"),Promise.resolve(3),Promise.resolve("v3"),Promise.resolve(5),Promise.resolve("v5"),Promise.resolve(7),Promise.resolve("v7"),Promise.resolve(9),Promise.resolve("v9")]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const r:api.Winner={index:10,value:1}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const r:api.Winner={index:0,value:'bad'}; }
