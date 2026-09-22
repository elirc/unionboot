import * as api from '../solutions/2555';
import {solve} from '../solutions/2555';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const renderer:api.Renderer=solve();const text:string=renderer.render({"count":3});const all:string[]=renderer.renderAll([]);void text;void all;
