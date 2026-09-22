// 1865 Precedence expression parsing / scenario 7 — precedence=flat; power=left; unaryPlus=true
// Prompt: ../prompts/1865.txt
'use strict';
const cfg={"precedence":"flat","power":"left","unaryPlus":true};
function expression(input) {
  const tokens=input.match(/\d+(?:\.\d+)?|[()+*\-\/^]/g)||[];
  if(tokens.join('')!==input.replace(/\s/g,''))throw new SyntaxError('Invalid expression');
  let pos=0;
  const precedence=op=>op==='^'?3:cfg.precedence==='flat'?1:(op==='+'||op==='-')?1:2;
  function atom(){const t=tokens[pos++];if(t==='('){const n=parse(0);if(tokens[pos++]!==')')throw new SyntaxError('Invalid expression');return n;}
    if(t==='-')return -atom();if(t==='+'&&cfg.unaryPlus)return atom();if(t===undefined||!/^\d/.test(t))throw new SyntaxError('Invalid expression');return Number(t);}
  function parse(min){let left=atom();while(pos<tokens.length&&tokens[pos]!==')'){
    const op=tokens[pos];if(!['+','-','*','/','^'].includes(op))throw new SyntaxError('Invalid expression');const p=precedence(op);if(p<min)break;pos++;
    const right=parse(p+(op==='^'&&cfg.power==='right'?0:1));
    left=op==='+'?left+right:op==='-'?left-right:op==='*'?left*right:op==='/'?left/right:left**right;
  }return left;}
  const result=parse(0);if(pos!==tokens.length||!Number.isFinite(result))throw new SyntaxError('Invalid expression');return Object.is(result,-0)?0:result;
}
module.exports=expression;
