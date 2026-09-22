import * as api from '../solutions/2548';
import {solve} from '../solutions/2548';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve()('x'); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve().call({},'x'); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve().call({"count":3,"tags":["a","b"]},1); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve().bind({...{"count":3,"tags":["a","b"]},count:"bad"}); }
