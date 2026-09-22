import {solve} from '../solutions/1002';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const input:unknown=['a']; if(solve(input)){const first:string|undefined=input[0];const rows:readonly string[]=input;void first;void rows;}
