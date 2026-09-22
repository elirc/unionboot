// 2462: Nested promise-container inference / async-container-depth=14
// Awaited within recursive records; promise identity boundaries
export type Input={next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:Promise<number>}}}}}}}}}}}}}};
export type Resolved<T>=T extends PromiseLike<infer U>?Awaited<U>:T extends {next:infer N}?{next:Resolved<N>}:T;
export function solve(input:Input): Promise<Resolved<Input>> {
  return (async()=>{let current:unknown=input;for(let i=0;i<14;i++)current=(current as {next:unknown}).next;let out:unknown=await current;for(let i=0;i<14;i++)out={next:out};return out as Resolved<Input>;})();
}
