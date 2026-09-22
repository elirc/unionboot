import {solve, Person, Decode} from '../solutions/982';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const result=solve({name:'a'} as unknown); if(result.ok){const name:string=result.value.name;const age:number|undefined=result.value.age;void name;void age;} const p:Person={name:'A'};void p;
