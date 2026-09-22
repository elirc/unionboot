import * as api from '../solutions/2214';
import {solve} from '../solutions/2214';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve("asset.mp3");const kind:"audio"=r.kind;const detail:44100=r.sampleRate;void kind;void detail;
