import {solve, Person, Decode} from '../solutions/983';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const bad:Person={name:'A',age:undefined}; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad:Person={name:1}; }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ const r=solve({}); r.value; }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve({}); if(r.ok){const age:number=r.value.age;} }
