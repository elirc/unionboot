// 1824 Wildcard topic bus / scenario 6 — order=priority; live=true; errors=collect
// Prompt: ../prompts/1824.txt
'use strict';
const cfg={"order":"priority","live":true,"errors":"collect"};
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
