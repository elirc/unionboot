import * as api from '../solutions/2647';
import {solve} from '../solutions/2647';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ solve([{payload:1}],1); }
// @ts-expect-error Case 2: reject incompatible property/position type
{ const p:api.Page={items:[],hasMore:true}; }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ const p:api.Page={items:[],hasMore:false,next:undefined}; }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ const cursor=null as unknown as api.Cursor;cursor.payload; }
