import {solve, Field, Change} from '../solutions/1344';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const r=solve('age',1);const event:'ageChanged'=r.event;const value:number=r.value;const word:string=solve('name','a').value;void event;void value;void word;
