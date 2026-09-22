import * as api from '../solutions/2093';
import {solve} from '../solutions/2093';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(["v1",true,4,"v4"]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve([null,"v1",true,4,"v4"]); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve([1,"v1",true,4,"v4"])[0]="v4"; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:string=solve([1,"v1",true,4,"v4"]); }
