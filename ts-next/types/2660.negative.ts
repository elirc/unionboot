import * as api from '../solutions/2660';
import {solve} from '../solutions/2660';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(1,2); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const l=null as unknown as api.Quantity<api.LengthPower>;const t=null as unknown as api.Quantity<api.DurationPower>;solve(t,l); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const p=null as unknown as api.Product;const bad:api.Quantity<api.LengthPower>=p; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const plain:api.Product=1; }
