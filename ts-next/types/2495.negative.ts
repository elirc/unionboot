import * as api from '../solutions/2495';
import {solve} from '../solutions/2495';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const p:api.Producer<Partial<api.Model>>={get:()=>({})};const bad:api.Producer<api.Model>=p; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({get:()=>({})}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({get:()=>({...{"count":3},count:"bad"})}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({get:()=>({"count":3})}).get().count; }
