import {solve, Tree} from '../solutions/960';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const tree:Tree<number>={value:1,children:[]}; const result:Tree<string>=solve(tree,String); const label:string=result.value; void label;
