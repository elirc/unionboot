import * as api from '../solutions/1972';
import {solve} from '../solutions/1972';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve({"value":{"value":{"value":{"value":7}}}}); const exact:7=r; const d=solve({"value":{"value":{"value":{"value":{"value":7}}}}}); const box:{readonly value:7}=d; type Chain=Assert<Equal<api.Peel<{ value: { value: { value: { value: string } } } }>,string>>; void exact;void box;
