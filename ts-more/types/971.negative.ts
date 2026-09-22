import {solve, Decode} from '../solutions/971';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const result=solve(1); result.value; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const result=solve(1); if(result.ok){const wrong:string=result.value;} }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const result=solve(1); if(!result.ok) result.value; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const wrong:number=solve(1); }
