// 1797 Decimal-string arithmetic / scenario 9 — op=maximum; pad=false
// Prompt: ../prompts/1797.txt
'use strict';
const cfg={"op":"maximum","pad":false};
// Why this works:
// Schoolbook arithmetic on digit strings. No operand is ever converted to a
// Number or a BigInt as a whole, which is the point: the test feeds
// '999999999999999999999999', far beyond Number.MAX_SAFE_INTEGER, and only the
// per-digit conversions stay exact.
// clean() is both the validator and the canonicaliser: it rejects anything that
// is not one or more digits with TypeError('Decimal digits required'), then
// strips leading zeros while keeping at least one digit, so '0012' becomes '12'
// and '0000' stays '0'.
// add() walks both strings from the right with a carry; a missing digit reads as
// 0, so operands of different lengths need no padding.
// cmp() compares canonical strings: more digits means larger, and equal lengths
// compare lexically, which for equal-length digit strings is numeric order.
// sub() is the borrow loop, and it assumes x >= y -- the callers guarantee that.
// multiply() accumulates every digit product into a positional array and only
// then normalises the carries, so no intermediate exceeds a safe integer.
// cfg.op selects the operation; cfg.pad left-pads the canonical result to the
// longer of the two ORIGINAL operand lengths, leading zeros included.
function decimalArithmetic(input) {
  const clean = s => {
    if (!/^\d+$/.test(s)) throw new TypeError('Decimal digits required');
    return s.replace(/^0+(?=\d)/, '');
  };
  const a = clean(input.a);
  const b = clean(input.b);
  const add = (x, y) => {
    let i = x.length - 1;
    let j = y.length - 1;
    let carry = 0;
    let out = '';
    while (i >= 0 || j >= 0 || carry) {
      const sum = Number(x[i--] || 0) + Number(y[j--] || 0) + carry;
      out = sum % 10 + out;
      carry = Math.floor(sum / 10);
    }
    return out;
  };
  const cmp = (x, y) =>
    x.length !== y.length ? Math.sign(x.length - y.length) : x < y ? -1 : x > y ? 1 : 0;
  const sub = (x, y) => {
    // Assumes x >= y; every caller checks with cmp first.
    let borrow = 0;
    let out = '';
    let j = y.length - 1;
    for (let i = x.length - 1; i >= 0; i--) {
      let digit = Number(x[i]) - Number(y[j--] || 0) - borrow;
      borrow = digit < 0 ? 1 : 0;
      if (borrow) digit += 10;
      out = digit + out;
    }
    return clean(out);
  };
  const multiply = (x, y) => {
    const digits = Array(x.length + y.length).fill(0);
    for (let i = x.length - 1; i >= 0; i--) {
      for (let j = y.length - 1; j >= 0; j--) {
        digits[i + j + 1] += Number(x[i]) * Number(y[j]);
      }
    }
    for (let i = digits.length - 1; i > 0; i--) {
      digits[i - 1] += Math.floor(digits[i] / 10);
      digits[i] %= 10;
    }
    return clean(digits.join(''));
  };
  let result;
  if (cfg.op === 'add') {
    result = add(a, b);
  } else if (cfg.op === 'difference') {
    result = cmp(a, b) < 0 ? sub(b, a) : sub(a, b);
  } else if (cfg.op === 'subtract') {
    if (cmp(a, b) < 0) throw new RangeError('Negative result');
    result = sub(a, b);
  } else if (cfg.op === 'multiply') {
    result = multiply(a, b);
  } else {
    result = cmp(a, b) >= 0 ? a : b;
  }
  return cfg.pad ? result.padStart(Math.max(input.a.length, input.b.length), '0') : result;
}
module.exports=decimalArithmetic;
