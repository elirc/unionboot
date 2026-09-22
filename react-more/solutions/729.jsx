// 729 Keyboard escape cleanup / scenario 11 — altKey + Escape; ignore text controls; initial open
// Output open/closed, Open button, and labelled Notes input. Global document keydown closes the panel on Escape only with altKey true. Ignore already-defaultPrevented events and events originating in INPUT or TEXTAREA. Other keys ignored. Initial state open. Render Panel content only while open. Register one listener in useEffect and remove the exact listener on unmount. Reopening must work repeatedly.
// Prompt: ../prompts/729.txt
// Run from unionboot: node react-more/verify.cjs --id=729 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(true);useEffect(()=>{const handler=e=>{if(e.defaultPrevented||['INPUT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='Escape'&&e.altKey)set(false);};document.addEventListener('keydown',handler);return ()=>document.removeEventListener('keydown',handler);},[]);return <section><output>{open?'open':'closed'}</output>{open&&<p>Panel content</p>}<label>Notes<input/></label><button onClick={()=>set(true)}>Open</button></section>;
}
