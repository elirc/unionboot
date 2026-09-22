// 1796 Decimal-string arithmetic / scenario 8 — op=multiply; pad=true
// Prompt: ../prompts/1796.txt
'use strict';
const cfg={"op":"multiply","pad":true};
function decimalArithmetic(input) {
  const clean=s=>{if(!/^\d+$/.test(s))throw new TypeError('Decimal digits required');return s.replace(/^0+(?=\d)/,'');};
  const a=clean(input.a),b=clean(input.b);
  const add=(x,y)=>{let i=x.length-1,j=y.length-1,carry=0,out='';while(i>=0||j>=0||carry){const n=Number(x[i--]||0)+Number(y[j--]||0)+carry;out=n%10+out;carry=Math.floor(n/10);}return out;};
  const cmp=(x,y)=>x.length!==y.length?Math.sign(x.length-y.length):x<y?-1:x>y?1:0;
  const sub=(x,y)=>{let borrow=0,out='',j=y.length-1;for(let i=x.length-1;i>=0;i--){let n=Number(x[i])-Number(y[j--]||0)-borrow;borrow=n<0?1:0;if(borrow)n+=10;out=n+out;}return clean(out);};
  let result;
  if(cfg.op==='add')result=add(a,b);
  else if(cfg.op==='difference')result=cmp(a,b)<0?sub(b,a):sub(a,b);
  else if(cfg.op==='subtract'){if(cmp(a,b)<0)throw new RangeError('Negative result');result=sub(a,b);}
  else if(cfg.op==='multiply'){
    const digits=Array(a.length+b.length).fill(0);
    for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)digits[i+j+1]+=Number(a[i])*Number(b[j]);
    for(let i=digits.length-1;i>0;i--){digits[i-1]+=Math.floor(digits[i]/10);digits[i]%=10;}result=clean(digits.join(''));
  }else result=cmp(a,b)>=0?a:b;
  return cfg.pad?result.padStart(Math.max(input.a.length,input.b.length),'0'):result;
}
module.exports=decimalArithmetic;
