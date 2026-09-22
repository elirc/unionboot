// 781 Two-stage form wizard / scenario 13 — name 2..5; preserved saved name; review acknowledgment; start over
// Step1 controlled Name field; Next enabled only for trimmed length 2..5. Preserve draft whitespace across Back. Step2 shows Review: trimmed name. Agree checkbox required to enable Finish; returning Back clears agreement. Back returns to edit without losing draft. Finish removes name/review controls and shows output Saved: NAME (preserved case). Start over available at every stage resets draft, agreement and step. No network.
// Prompt: ../prompts/781.txt
// Run from unionboot: node react-more/verify.cjs --id=781 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [step,setStep]=useState(1),[name,set]=useState(''),[agree,check]=useState(false);const reset=()=>{setStep(1);set('');check(false);};const valid=name.trim().length>=2&&name.trim().length<=5;return <section>{step===1?<div><label>Name<input value={name} onChange={e=>set(e.target.value)}/></label><button disabled={!valid} onClick={()=>{if(valid)setStep(2);}}>Next</button></div>:step===2?<div><p>Review: {name.trim()}</p><label>Agree<input type="checkbox" checked={agree} onChange={e=>check(e.target.checked)}/></label><button onClick={()=>{check(false);setStep(1);}}>Back</button><button disabled={!agree} onClick={()=>{if(agree)setStep(3);}}>Finish</button></div>:<output>Saved: {name.trim()}</output>}<button onClick={reset}>Start over</button></section>;
}
