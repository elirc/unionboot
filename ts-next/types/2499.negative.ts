import * as api from '../solutions/2499';
import {solve} from '../solutions/2499';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const p:api.Producer<Partial<api.Model>>={get:()=>({})};const bad:api.Producer<api.Model>=p; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({get:()=>({})}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({get:()=>({...{"count":3,"active":true},count:"bad"})}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve({get:()=>({"count":3,"active":true})}).get().count; }
