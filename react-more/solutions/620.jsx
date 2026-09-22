// 620 Exclusive accordion / scenario 12 — one must stay open; One disabled; hide closed content
// Sections One/Two/Three. One is disabled and never opens. Initially Two open. Only one can be open. Clicking the open section keeps it open. Buttons expose aria-expanded and aria-controls pointing to content IDs. Keep content in the DOM with hidden=true while closed.
// Prompt: ../prompts/620.txt
// Run from unionboot: node react-more/verify.cjs --id=620 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(1);return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} aria-controls={'panel-'+i} disabled={i===0} onClick={()=>set(old=>old===i?i:i)}>{name}</button><p id={'panel-'+i} hidden={open!==i}>{name} content</p></div>)}</section>;
}
