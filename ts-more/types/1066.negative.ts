import {solve} from '../solutions/1066';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({id:1},'missing',2); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({id:1},'id','2'); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({id:1,name:'A'},'name',2); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve({id:1} as const,'id',2); }
