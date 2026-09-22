import * as api from '../solutions/2420';
import {solve} from '../solutions/2420';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const r=solve({"next":{"next":{"leaf":7}}});r.next=r.next; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const r=solve({"next":{"next":{"leaf":7}}});r.next.next=r.next.next; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const bad:string=solve({"next":{"next":{"leaf":7}}}).next.next.leaf; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({"next":{"next":{"leaf":7}}}).missing; }
