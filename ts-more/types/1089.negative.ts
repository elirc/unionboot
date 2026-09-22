import {solve, Settings, Patch} from '../solutions/1089';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ const p:Patch={name:undefined}; }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ solve({name:'a',retries:2,enabled:true},{retries:'3'}); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ solve({name:'a',retries:2,enabled:true},{missing:1}); }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ const r=solve({name:'a',retries:2,enabled:true},{});r.enabled=false; }
