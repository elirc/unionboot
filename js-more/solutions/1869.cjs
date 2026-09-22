// 1869 LCS edit scripts / scenario 1 — tie=delete; fold=false; output=ops
// Prompt: ../prompts/1869.txt
'use strict';
const cfg={"tie":"delete","fold":false,"output":"ops"};
function lcsDiff(input) {
  const a=[...input.a],b=[...input.b],dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  const equal=(x,y)=>cfg.fold?x.toLowerCase()===y.toLowerCase():x===y;
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)dp[i][j]=equal(a[i],b[j])?1+dp[i+1][j+1]:Math.max(dp[i+1][j],dp[i][j+1]);
  let i=0,j=0;const ops=[],kept=[];
  while(i<a.length||j<b.length){
    if(i<a.length&&j<b.length&&equal(a[i],b[j])){ops.push(['keep',b[j]]);kept.push(b[j]);i++;j++;}
    else if(i<a.length&&(j===b.length||dp[i+1][j]>dp[i][j+1]||(dp[i+1][j]===dp[i][j+1]&&cfg.tie==='delete'))){ops.push(['delete',a[i++]]);}
    else ops.push(['insert',b[j++]]);
  }
  if(cfg.output==='length')return kept.length;
  if(cfg.output==='common')return kept.join('');
  return ops;
}
module.exports=lcsDiff;
