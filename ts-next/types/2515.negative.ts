import * as api from '../solutions/2515';
import {solve} from '../solutions/2515';
// @ts-expect-error Case 1: reject invalid input or unsafe variance
{ const narrow:api.Consumer<api.Model>={accept:value=>{void value;}};const bad:api.Consumer<Partial<api.Model>>=narrow; }
// @ts-expect-error Case 2: reject incompatible property/position type
{ solve({accept:(value:api.Model)=>{void value;}}); }
// @ts-expect-error Case 3: reject missing capability or unsafe result access
{ solve({accept:()=>{}}).accept({}); }
// @ts-expect-error Case 4: reject invalid output/arity/mutability
{ solve({accept:()=>{}}).accept({...{"name":"Ada","count":3,"active":true},name:42}); }
