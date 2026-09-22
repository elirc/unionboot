// 698 Password visibility and length / scenario 10 — length 7..11; digit required; raw evaluation; blur re-hides
// Controlled Password field initially hidden and empty; Show/Hide is a type=button toggle preserving value, with aria-pressed. Blur always re-hides. Output short when evaluated length <7, long when >11, digit when within length but no ASCII digit, ready otherwise. Evaluate raw input value. Clear empties value and hides again.
// Prompt: ../prompts/698.txt
// Run from unionboot: node react-more/verify.cjs --id=698 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[visible,show]=useState(false);const value=text;const state=value.length<7?'short':value.length>11?'long':!/[0-9]/.test(value)?'digit':'ready';return <section><label>Password<input type={visible?'text':'password'} value={text} onChange={e=>set(e.target.value)} onBlur={()=>show(false)}/></label><button type="button" aria-pressed={visible} onClick={()=>show(x=>!x)}>{visible?'Hide':'Show'}</button><button type="button" onClick={()=>{set('');show(false);}}>Clear</button><output>{state}</output></section>;
}
