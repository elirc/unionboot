import * as api from '../solutions/2649';
import {solve} from '../solutions/2649';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const page=solve([{...{"count":3,"active":true},payload:null}],1);if(page.hasMore){const v:number=page.next.count;void v;}const done:api.Page={items:[],hasMore:false};void done;
