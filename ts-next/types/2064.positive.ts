import * as api from '../solutions/2064';
import {solve} from '../solutions/2064';
type Assert<T extends true>=T;
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type NotAny<T>=0 extends (1&T)?false:true;
type SafeFunction=Assert<NotAny<typeof solve>>;
const r=solve([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);const exact:readonly [readonly [1, 2, 3, 4, 5, 6], readonly [2, 3, 4, 5, 6, 7], readonly [3, 4, 5, 6, 7, 8], readonly [4, 5, 6, 7, 8, 9], readonly [5, 6, 7, 8, 9, 10], readonly [6, 7, 8, 9, 10, 11], readonly [7, 8, 9, 10, 11, 12], readonly [8, 9, 10, 11, 12, 13], readonly [9, 10, 11, 12, 13, 14], readonly [10, 11, 12, 13, 14, 15], readonly [11, 12, 13, 14, 15, 16], readonly [12, 13, 14, 15, 16, 17]]=r;const empty:readonly []=solve([]);void exact;void empty;
