import {solve, State, Action} from '../solutions/1034';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({value:0,history:[]},{type:'add'}); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({value:0,history:[]},{type:'reset',amount:2}); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({value:0,history:[]},{type:'divide',factor:2}); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const s=solve({value:0,history:[]},{type:'reset'}); s.history.push(1); }
