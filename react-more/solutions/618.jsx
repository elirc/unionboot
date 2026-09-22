// 618 Exclusive accordion / scenario 10 — one must stay open; Two disabled; unmount closed content
// Sections One/Two/Three. Two is disabled and never opens. Initially Three open. Only one can be open. Clicking the open section keeps it open. Buttons expose aria-expanded and aria-controls pointing to content IDs. Unmount closed content.
// Prompt: ../prompts/618.txt
// Run from unionboot: node react-more/verify.cjs --id=618 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(2);return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} aria-controls={'panel-'+i} disabled={i===1} onClick={()=>set(old=>old===i?i:i)}>{name}</button>{open===i&&<p id={'panel-'+i}>{name} content</p>}</div>)}</section>;
}
