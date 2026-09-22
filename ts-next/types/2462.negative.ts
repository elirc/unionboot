import * as api from '../solutions/2462';
import {solve} from '../solutions/2462';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve({"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":1}}}}}}}}}}}}}}); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const input=null as unknown as api.Input;const bad:string=solve(input); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const input=null as unknown as api.Input;async function bad(){const r=await solve(input);const p:Promise<number>=r.next.next.next.next.next.next.next.next.next.next.next.next.next.next;} }
