import * as api from '../solutions/2203';
import {solve} from '../solutions/2203';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve("a-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b");const exact:"aBBBBBBBBBB-b-b-b-b-b-b-b"=r;const basic:'helloWorld'=solve('hello-world');void exact;void basic;
