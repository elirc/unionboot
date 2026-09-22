import * as api from '../solutions/2546';
import {solve} from '../solutions/2546';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve()('x'); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve().call({},'x'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve().call({"tags":["a","b"]},1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve().bind({...{"tags":["a","b"]},tags:42}); }
