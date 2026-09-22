import {solve} from '../solutions/831';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const nums: number[] = solve([{id:1,name:'a'}], 'id'); const labels: string[] = solve([{id:1,name:'a'}], 'name'); const rows: readonly {optional?:number}[] = [{}]; const maybe: (number|undefined)[] = solve(rows,'optional'); void nums; void labels; void maybe;
