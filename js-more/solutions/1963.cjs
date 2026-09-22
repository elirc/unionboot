// 1963 Polynomial convolution / scenario 5 — modulus=5; trim=false
// Prompt: ../prompts/1963.txt
'use strict';
const cfg={"modulus":5,"trim":false};
// Why this works:
// Multiplying two polynomials is a convolution: the coefficient of x^(i+j) in
// the product collects a[i]*b[j] for every pair, so one double loop over the
// two coefficient arrays fills the answer. The product of degrees d1 and d2
// has d1+d2+1 coefficients, which is a.length + b.length - 1.
// Either input empty means there is no polynomial at all, so the result is [],
// handled before the width is computed.
// Policy modulus=cfg.modulus reduces every coefficient into 0..modulus-1;
// ((x % m) + m) % m is used rather than x % m because JavaScript's remainder
// keeps the sign of the dividend, so -3 % 5 is -3, not 2. A modulus of 0 means
// no reduction at all.
// Policy trim=cfg.trim drops trailing zero coefficients; with trim=false the
// full width is preserved even when the top coefficients are zero.
// Nothing writes to input.a or input.b.
function polynomial(input) {
  if (!input.a.length || !input.b.length) {
    return [];
  }
  const out = Array(input.a.length + input.b.length - 1).fill(0);
  for (let i = 0; i < input.a.length; i++) {
    for (let j = 0; j < input.b.length; j++) {
      out[i + j] += input.a[i] * input.b[j];
    }
  }
  const reduced = out.map(x => (cfg.modulus ? ((x % cfg.modulus) + cfg.modulus) % cfg.modulus : x));
  if (cfg.trim) {
    while (reduced.length && reduced.at(-1) === 0) {
      reduced.pop();
    }
  }
  return reduced;
}
module.exports=polynomial;
