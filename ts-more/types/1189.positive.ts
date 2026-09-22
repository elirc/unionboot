import {solve} from '../solutions/1189';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const counts:Map<'a'|'b',number>=solve(['a','b'] as const);const objects:Map<{id:number},number>=solve([{id:1}]);void counts;void objects;
