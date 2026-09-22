import {solve, Result} from '../solutions/1296';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const input:Result<number,'first'>={ok:true,value:1};const out=solve<number,'first',string,'second'>(input,n=>({ok:true,value:String(n)}));if(out.ok){const s:string=out.value;void s;}else{const e:'first'|'second'=out.error;void e;}
