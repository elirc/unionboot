import {solve, Result} from '../solutions/1230';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve(1); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad:Promise<Result<string>>=solve(()=>1); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ async function bad(){const r=await solve(()=>1);if(!r.ok) r.error.message;} }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ async function bad(){const r=await solve(()=>1);r.value;} }
