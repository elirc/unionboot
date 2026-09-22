import {solve} from '../solutions/1101';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const result=solve({id:1,nested:{value:2}});const id:number=result.id;result.nested.value=3;const copy:Readonly<{id:number}>=result;void id;void copy;
