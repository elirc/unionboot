import * as api from '../solutions/2141';
import {solve} from '../solutions/2141';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve(...[2,true,"item3",5,false,"item6",8]); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve(null,2,true,"item3",5,false,"item6",8); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve(...["item0",2,true,"item3",5,false,"item6",8],'extra'); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const bad:number=solve(...["item0",2,true,"item3",5,false,"item6",8]); }
