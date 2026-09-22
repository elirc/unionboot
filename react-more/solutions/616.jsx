// 616 Exclusive accordion / scenario 8 — one must stay open; Three disabled; unmount closed content
// Sections One/Two/Three. Three is disabled and never opens. Initially One open. Only one can be open. Clicking the open section keeps it open. Buttons expose aria-expanded and aria-controls pointing to content IDs. Unmount closed content.
// Prompt: ../prompts/616.txt
// Run from unionboot: node react-more/verify.cjs --id=616 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(0);return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} aria-controls={'panel-'+i} disabled={i===2} onClick={()=>set(old=>old===i?i:i)}>{name}</button>{open===i&&<p id={'panel-'+i}>{name} content</p>}</div>)}</section>;
}
