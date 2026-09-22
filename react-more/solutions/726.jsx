// 726 Keyboard escape cleanup / scenario 8 — altKey + Enter; allow text controls; initial open
// Output open/closed, Open button, and labelled Notes input. Global document keydown closes the panel on Enter only with altKey true. Ignore already-defaultPrevented events. Other keys ignored. Initial state open. Render Panel content only while open. Register one listener in useEffect and remove the exact listener on unmount. Reopening must work repeatedly.
// Prompt: ../prompts/726.txt
// Run from unionboot: node react-more/verify.cjs --id=726 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [open,set]=useState(true);useEffect(()=>{const handler=e=>{if(e.defaultPrevented)return;if(e.key==='Enter'&&e.altKey)set(false);};document.addEventListener('keydown',handler);return ()=>document.removeEventListener('keydown',handler);},[]);return <section><output>{open?'open':'closed'}</output>{open&&<p>Panel content</p>}<label>Notes<input/></label><button onClick={()=>set(true)}>Open</button></section>;
}
