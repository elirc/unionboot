import * as api from '../solutions/2566';
import {solve} from '../solutions/2566';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ new api.Renderer(); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ class Broken extends api.Renderer {} }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve().render({}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve().render({...{"name":"Ada","active":true,"tags":["a","b"]},name:42}); }
