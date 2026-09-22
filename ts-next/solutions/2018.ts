// 2018: Minimum-width tuple padding / minimum-width=5
// recursive tuple construction; padding unions
export type Pad<T extends readonly unknown[],F,A extends unknown[]=[]>=A['length'] extends 5?readonly [...A,...T]:T extends readonly [infer H,...infer R]?Pad<R,F,[...A,H]>:Pad<[],F,[...A,F]>;
export function solve<const T extends readonly unknown[],const F>(input:T & (number extends T['length']?never:unknown),fill:F): Pad<T,F> {
  const out:unknown[]=[...input];while(out.length<5)out.push(fill);/* Preserve every input position, then append only fill until the target width: exactly Pad<T,F>. */ return out as unknown as Pad<T,F>;
}
