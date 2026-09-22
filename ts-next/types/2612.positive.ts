import * as api from '../solutions/2612';
import {solve} from '../solutions/2612';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const result:Promise<api.Winner>=solve([Promise.resolve(1),Promise.resolve("v1"),Promise.resolve(3),Promise.resolve("v3"),Promise.resolve(5),Promise.resolve("v5"),Promise.resolve(7),Promise.resolve("v7"),Promise.resolve(9),Promise.resolve("v9"),Promise.resolve(11),Promise.resolve("v11"),Promise.resolve(13),Promise.resolve("v13")]);async function check(){const r=await result;if(r.index===0){const value:number=r.value;void value;}}void check;
