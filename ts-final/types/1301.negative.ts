import {solve, Result} from '../solutions/1301';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve({ok:true,value:1},(s:string)=>({ok:true as const,value:s})); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({ok:true,value:1},n=>n); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({ok:false},n=>({ok:true as const,value:n})); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve({ok:true,value:1},n=>({ok:true as const,value:String(n)}));if(r.ok){const bad:number=r.value;} }
