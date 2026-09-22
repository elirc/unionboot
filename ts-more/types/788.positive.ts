import {solve} from '../solutions/788';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const out = solve([1,2] as const, n => n > 1); const exact: (1|2)[] = out[0]; const objects: {id:string}[] = solve([{id:'x'}], x => x.id.length > 0)[0]; void exact; void objects;
