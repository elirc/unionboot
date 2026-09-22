// 617 Exclusive accordion / scenario 9 — all may close; One disabled; unmount closed content
// Sections One/Two/Three. One is disabled and never opens. Initially all closed. Only one can be open. Clicking the open section closes it. Buttons expose aria-expanded and aria-controls pointing to content IDs. Unmount closed content.
// Prompt: ../prompts/617.txt
// Run from unionboot: node react-more/verify.cjs --id=617 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(null);return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} aria-controls={'panel-'+i} disabled={i===0} onClick={()=>set(old=>old===i?null:i)}>{name}</button>{open===i&&<p id={'panel-'+i}>{name} content</p>}</div>)}</section>;
}
