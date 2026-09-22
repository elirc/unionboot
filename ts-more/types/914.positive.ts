import {solve, SearchResult} from '../solutions/914';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const result = solve(['a'],x=>x.length>0); if(result.found) { const s: string = result.value; const n:number=result.index; void s; void n; } else { const missing: {found:false}=result; void missing; }
