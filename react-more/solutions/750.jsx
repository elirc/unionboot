// 750 Ref focus controls / scenario 12 — focus First; clear target; select text; fallback when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables First. Focus button falls back to the other input when target is locked. Focusing selects all text without changing either value. Clear empties only First, then focuses target if enabled, otherwise the other input. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/750.txt
// Run from unionboot: node react-more/verify.cjs --id=750 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [a,setA]=useState('alpha'),[b,setB]=useState('beta'),[locked,lock]=useState(false);const first=useRef(null),second=useRef(null);const target=first,other=second;function focus(ref){ref.current.focus();ref.current.select();}return <section><label>First<input ref={first} disabled={locked} value={a} onChange={e=>setA(e.target.value)}/></label><label>Second<input ref={second} disabled={false} value={b} onChange={e=>setB(e.target.value)}/></label><label>Lock target<input type="checkbox" checked={locked} onChange={e=>lock(e.target.checked)}/></label><button disabled={false} onClick={()=>focus(locked?other:target)}>Focus</button><button onClick={()=>{setA('');const ref=locked?other:target;ref.current.focus();}}>Clear</button></section>;
}
