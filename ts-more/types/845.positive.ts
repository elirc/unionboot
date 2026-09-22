import {solve} from '../solutions/845';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const rows: {id:number}[] = solve([{id:1}], row => row.id); const words: string[] = solve(['a'], word => word.length); void rows; void words;
