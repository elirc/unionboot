import * as api from '../solutions/2497';
import {solve} from '../solutions/2497';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const p:api.Producer<Partial<api.Model>>={get:()=>({})};const bad:api.Producer<api.Model>=p; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({get:()=>({})}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({get:()=>({...{"active":true},active:0})}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:boolean=solve({get:()=>({"active":true})}).get().active; }
