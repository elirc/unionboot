import {solve} from '../solutions/1261';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const out:Promise<[number,'a',true]>=solve([Promise.resolve(1),'a',true] as const);async function check(){const r=await solve([Promise.resolve(1),'x'] as const);r[0]=2;const word:'x'=r[1];void word;}void out;void check;
