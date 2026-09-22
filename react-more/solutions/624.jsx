// 624 Accessible tab selection / scenario 6 — horizontal; automatic activation; disabled Red; initial 1
// Red/Green/Blue tabs in a tablist with aria-orientation=horizontal. Red is disabled. Initially select and make focusable index 1. ArrowRight/ArrowLeft move focus, skip disabled tabs, wrap. Home/End focus first/last enabled tab. Navigation also selects the focused tab. Click selects and focuses. Ignore the other axis. Use roving tabIndex, aria-selected and one tabpanel showing the selected name.
// Prompt: ../prompts/624.txt
// Run from unionboot: node react-more/verify.cjs --id=624 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const names=['Red','Green','Blue'],allowed=[1,2];const [selected,select]=useState(1),[focused,focus]=useState(1);const refs=useRef([]);const move=i=>{focus(i);select(i);refs.current[i].focus();};return <section><div role="tablist" aria-orientation="horizontal">{names.map((name,i)=><button key={name} role="tab" ref={el=>{refs.current[i]=el;}} disabled={i===0} tabIndex={focused===i?0:-1} aria-selected={selected===i} onClick={()=>{select(i);focus(i);refs.current[i].focus();}} onKeyDown={e=>{let next;if(e.key==='ArrowRight')next=allowed[(allowed.indexOf(i)+1)%allowed.length];else if(e.key==='ArrowLeft')next=allowed[(allowed.indexOf(i)+allowed.length-1)%allowed.length];else if(e.key==='Home')next=allowed[0];else if(e.key==='End')next=allowed[allowed.length-1];if(next!==undefined){e.preventDefault();move(next);}}}>{name}</button>)}</div><div role="tabpanel">{names[selected]}</div></section>;
}
