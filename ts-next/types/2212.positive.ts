import * as api from '../solutions/2212';
import {solve} from '../solutions/2212';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve("asset.txt");const kind:"text"=r.kind;const detail:"utf8"=r.encoding;void kind;void detail;
