import * as api from '../solutions/2222';
import {solve} from '../solutions/2222';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve('a.exe'); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve(1); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve("asset.mp3").kind="audio"; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve("asset.mp3").extension; }
