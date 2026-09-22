// 1848 Lazy iterator pipelines / scenario 10 — mode=double; take=4
// Prompt: ../prompts/1848.txt
'use strict';
const cfg={"mode":"double","take":4};
function lazyPipeline(input) {
  return (function*(){
    if(cfg.take===0)return;let emitted=0;
    for(const value of input){
      if(cfg.mode==='even'&&value%2!==0)continue;
      if(cfg.mode==='positive'&&value<=0)continue;
      yield cfg.mode==='square'?value*value:cfg.mode==='negate'?-value:cfg.mode==='double'?value*2:value;
      if(++emitted===cfg.take)return;
    }
  })();
}
module.exports=lazyPipeline;
