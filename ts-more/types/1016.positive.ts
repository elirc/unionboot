import {solve, Shape} from '../solutions/1016';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const n:number=solve({kind:'circle',radius:2}); const shapes:readonly Shape[]=[{kind:'rectangle',width:1,height:2}]; shapes.map(solve);void n;
