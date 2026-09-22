import {solve} from '../solutions/1257';
// @ts-expect-error Contract must reject case 1: incompatible shape, key, value, or unsafe access
{ solve(1); }
// @ts-expect-error Contract must reject case 2: incompatible shape, key, value, or unsafe access
{ const bad:Promise<[string,number]>=solve([Promise.resolve(1),'x'] as const); }
// @ts-expect-error Contract must reject case 3: incompatible shape, key, value, or unsafe access
{ async function bad(){const r=await solve([1,'x'] as const);r[2];} }
// @ts-expect-error Contract must reject case 4: incompatible shape, key, value, or unsafe access
{ async function bad(){const r=await solve([Promise.resolve(1),'x'] as const);r[0]='x';} }
