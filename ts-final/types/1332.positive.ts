import {solve} from '../solutions/1332';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const input:{user?:{name:string;age:number}}={};const name:string|undefined=solve(input,['user','name']);const age:number|undefined=solve(input,['user','age'] as const);void name;void age;
