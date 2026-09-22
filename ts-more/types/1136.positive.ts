import {solve} from '../solutions/1136';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const pair=solve('ready',3);const exact:readonly ['ready',3]=pair;const obj=solve({name:'A'},[1,2]);const name:'A'=obj[0].name;const values:readonly [1,2]=obj[1];void exact;void name;void values;
