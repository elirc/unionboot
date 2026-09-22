import * as api from '../solutions/2574';
import {solve} from '../solutions/2574';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const out=solve({...{"count":3,"active":true},extra:1});const extra:number=out.extra;const audit:string=out.auditCount();void extra;void audit;
