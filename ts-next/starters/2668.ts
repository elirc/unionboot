// 2668: Unit-exponent quantity multiplication / left-length-exponent=10
// unique-symbol dimension brands; exponent tuple composition
declare const dimension:unique symbol;
export type Quantity<P extends readonly unknown[]> = number&{readonly [dimension]:P};
export type LengthPower=readonly ["length", "length", "length", "length", "length", "length", "length", "length", "length", "length"];
export type DurationPower=readonly ['time'];
export type Product=Quantity<readonly [...LengthPower,...DurationPower]>;
export function solve(length:Quantity<LengthPower>,duration:Quantity<DurationPower>): Product {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2668');
}
