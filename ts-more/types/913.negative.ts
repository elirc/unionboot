import {solve, SearchResult} from '../solutions/913';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve([1], (x: string) => true); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const r=solve([1],()=>true); r.value; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const r=solve([1],()=>true); if(!r.found) r.index; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve([1],()=>true); if(r.found) { const bad:string=r.value; } }
