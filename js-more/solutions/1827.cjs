// 1827 Wildcard topic bus / scenario 9 — order=priority; live=false; errors=throw
// Prompt: ../prompts/1827.txt
'use strict';
const cfg={"order":"priority","live":false,"errors":"throw"};
function topicBus() {
  let serial=0;const listeners=[];
  const matches=(pattern,topic)=>{
    const p=pattern.split('.'),t=topic.split('.');
    for(let i=0;i<p.length;i++){if(p[i]==='**')return true;if(i>=t.length||(p[i]!=='*'&&p[i]!==t[i]))return false;}return p.length===t.length;
  };
  return {
    subscribe(pattern,callback,priority=0){const item={pattern,callback,priority,serial:serial++,active:true};listeners.push(item);return()=>{item.active=false;};},
    emit(topic,value){
      const snapshot=listeners.filter(x=>x.active&&matches(x.pattern,topic));
      snapshot.sort((a,b)=>cfg.order==='priority'?b.priority-a.priority||a.serial-b.serial:cfg.order==='reverse'?b.serial-a.serial:a.serial-b.serial);
      const errors=[];let delivered=0;
      for(const item of snapshot){if(cfg.live&&!item.active)continue;
        delivered++;try{item.callback(value,topic);}catch(e){if(cfg.errors==='throw')throw e;errors.push(String(e.message||e));}
      }
      return {delivered,errors};
    }
  };
}
module.exports=topicBus;
