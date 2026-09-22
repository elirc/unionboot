import {solve, Result} from '../solutions/943';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const rows: Result<number,string>[]=[{ok:true,value:1},{ok:false,error:'x'}]; const result=solve(rows); const values:number[]=result.values; const errors:string[]=result.errors; void values;void errors;
