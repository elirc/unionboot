import {solve} from '../solutions/467';
const good=solve([]);void good;
// @ts-expect-error invalid status literal
solve([{id:'x',amount:1,status:'other',team:'t'}]);
// @ts-expect-error amount cannot be a string
solve([{id:'x',amount:'1',status:'open',team:'t'}]);
