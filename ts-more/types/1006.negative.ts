import {solve} from '../solutions/1006';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const input:unknown=[]; if(solve(input)){input.push('a');} }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const input:unknown=[]; if(solve(input)){const bad:number|undefined=input[0];} }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const output:string=solve([]); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const input:unknown=[]; input[0]; }
