// 703 Password visibility and length / scenario 15 — length 7..11; no digit rule; trim for evaluation; blur re-hides
// Controlled Password field initially hidden and empty; Show/Hide is a type=button toggle preserving value, with aria-pressed. Blur always re-hides. Output short when evaluated length <7, long when >11, ready otherwise. Evaluate a trimmed copy but keep original input value. Clear empties value and hides again.
// Prompt: ../prompts/703.txt
// Run from unionboot: node react-more/verify.cjs --id=703 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[visible,show]=useState(false);const value=text.trim();const state=value.length<7?'short':value.length>11?'long':'ready';return <section><label>Password<input type={visible?'text':'password'} value={text} onChange={e=>set(e.target.value)} onBlur={()=>show(false)}/></label><button type="button" aria-pressed={visible} onClick={()=>show(x=>!x)}>{visible?'Hide':'Show'}</button><button type="button" onClick={()=>{set('');show(false);}}>Clear</button><output>{state}</output></section>;
}
