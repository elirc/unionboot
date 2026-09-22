// 619 Exclusive accordion / scenario 11 — all may close; Three disabled; hide closed content
// Sections One/Two/Three. Three is disabled and never opens. Initially all closed. Only one can be open. Clicking the open section closes it. Buttons expose aria-expanded and aria-controls pointing to content IDs. Keep content in the DOM with hidden=true while closed.
// Prompt: ../prompts/619.txt
// Run from unionboot: node react-more/verify.cjs --id=619 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(null);return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} aria-controls={'panel-'+i} disabled={i===2} onClick={()=>set(old=>old===i?null:i)}>{name}</button><p id={'panel-'+i} hidden={open!==i}>{name} content</p></div>)}</section>;
}
