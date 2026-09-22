import {solve, Field, Change} from '../solutions/1348';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve('age','1'); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve('name',1); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve('missing',true); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const bad:'nameChanged'=solve('age',1).event; }
