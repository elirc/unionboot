// 810: Generic chunk boundaries / scenario 12
// generics; indexed access; validation
// Split into consecutive nonempty chunks of size, except possibly the last. Validate positive safe-integer size even for an empty input. Invalid size throws Error("Invalid size"). Return fresh arrays, preserving element references.
// Scenario family repetition is intentional; see prompts/810.txt and tests/810.cjs.
export function solve<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isSafeInteger(size) || size < 1) throw new Error('Invalid size'); const out: T[][] = []; for (let i=0;i<items.length;i+=size) out.push(items.slice(i,i+size)); return out;
}
