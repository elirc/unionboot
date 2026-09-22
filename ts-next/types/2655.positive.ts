import * as api from '../solutions/2655';
import {solve} from '../solutions/2655';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const page=solve([{...{"active":true,"tags":["a","b"]},payload:null}],1);if(page.hasMore){const v:boolean=page.next.active;void v;}const done:api.Page={items:[],hasMore:false};void done;
