import * as api from '../solutions/2419';
import {solve} from '../solutions/2419';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const r=solve({"next":{"leaf":7}});r.next=r.next; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const r=solve({"next":{"leaf":7}});r.next=r.next; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:string=solve({"next":{"leaf":7}}).next.leaf; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"next":{"leaf":7}}).missing; }
