import * as api from '../solutions/2707';
import {solve} from '../solutions/2707';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve([1,2,3,4,5],2);const degree:4=r.degree;const value:number=r.value;void degree;void value;
