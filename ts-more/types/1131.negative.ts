import {solve} from '../solutions/1131';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const p=solve('a',1);p[0]='a'; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const p=solve('a',1);const bad:readonly [1,'a']=p; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve(1); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const p=solve('a',1);const bad:2=p[1]; }
