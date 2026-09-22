import {solve, Shape} from '../solutions/1013';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({kind:'circle',width:2}); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({kind:'square',width:2}); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({kind:'triangle',base:2}); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ solve({kind:'rectangle',width:'2',height:3}); }
