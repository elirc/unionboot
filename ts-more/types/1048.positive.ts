import {solve} from '../solutions/1048';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const result=solve({id:1,name:'A'},['id']); const id:number=result.id; const readonly=solve({id:1} as const,['id']); const exact:1=readonly.id;void id;void exact;
