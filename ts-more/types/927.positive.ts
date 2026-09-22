import {solve, Result} from '../solutions/927';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const input: Result<number,'offline'> = {ok:true,value:1}; const result=solve<number,'offline',string>(input,String); if(result.ok) {const s:string=result.value;void s;} else {const e:'offline'=result.error;void e;}
