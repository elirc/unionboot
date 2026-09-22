import * as api from '../solutions/1990';
import {solve} from '../solutions/1990';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const bad:readonly []=solve([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]).push(1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])[0]; }
