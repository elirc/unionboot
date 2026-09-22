// 1866 Precedence expression parsing / scenario 8 — precedence=flat; power=right; unaryPlus=true
// Prompt: ../prompts/1866.txt
'use strict';
const cfg={"precedence":"flat","power":"right","unaryPlus":true};
// Why this works:
// One precedence-climbing parser over a token array, no eval and no Function,
// which the prompt requires and only a source review can check.
// The regular expression splits the input into numbers and single-character
// operators; re-joining the tokens and comparing against the whitespace-free
// input rejects any character the tokenizer skipped, such as a letter.
// parse(minPrecedence) reads one atom, then keeps absorbing operators whose
// precedence is at least minPrecedence. Recursing at level+1 makes an operator
// left-associative; recursing at level makes it right-associative, which is
// how cfg.power switches '^'.
// Policy precedence=flat gives + - * / the same level 1, so a flat expression
// is evaluated strictly left to right. Policy unaryPlus decides whether a
// leading '+' is an atom or a syntax error. Unary minus is always an atom, so
// it binds tighter than '^'. Division by zero produces Infinity and is caught
// by the Number.isFinite guard, as SyntaxError('Invalid expression').
function expression(input) {
  const tokens = input.match(/\d+(?:\.\d+)?|[()+*\-\/^]/g) || [];
  if (tokens.join('') !== input.replace(/\s/g, '')) {
    throw new SyntaxError('Invalid expression');
  }
  let pos = 0;

  const precedence = op => {
    if (op === '^') return 3;
    if (cfg.precedence === 'flat') return 1;
    return (op === '+' || op === '-') ? 1 : 2;
  };

  function atom() {
    const token = tokens[pos++];
    if (token === '(') {
      const inner = parse(0);
      if (tokens[pos++] !== ')') throw new SyntaxError('Invalid expression');
      return inner;
    }
    if (token === '-') return -atom();
    if (token === '+' && cfg.unaryPlus) return atom();
    if (token === undefined || !/^\d/.test(token)) throw new SyntaxError('Invalid expression');
    return Number(token);
  }

  function parse(minPrecedence) {
    let left = atom();
    while (pos < tokens.length && tokens[pos] !== ')') {
      const op = tokens[pos];
      if (!['+', '-', '*', '/', '^'].includes(op)) throw new SyntaxError('Invalid expression');
      const level = precedence(op);
      if (level < minPrecedence) break;
      pos++;
      const right = parse(level + (op === '^' && cfg.power === 'right' ? 0 : 1));
      left = op === '+' ? left + right
        : op === '-' ? left - right
        : op === '*' ? left * right
        : op === '/' ? left / right
        : left ** right;
    }
    return left;
  }

  const result = parse(0);
  if (pos !== tokens.length || !Number.isFinite(result)) {
    throw new SyntaxError('Invalid expression');
  }
  return Object.is(result, -0) ? 0 : result;
}
module.exports=expression;
