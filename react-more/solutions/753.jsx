// 753 Ref focus controls / scenario 15 — focus Second; clear target; select text; fallback when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables Second. Focus button falls back to the other input when target is locked. Focusing selects all text without changing either value. Clear empties only Second, then focuses target if enabled, otherwise the other input. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/753.txt
// Run from unionboot: node react-more/verify.cjs --id=753 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [a,setA]=useState('alpha'),[b,setB]=useState('beta'),[locked,lock]=useState(false);const first=useRef(null),second=useRef(null);const target=second,other=first;function focus(ref){ref.current.focus();ref.current.select();}return <section><label>First<input ref={first} disabled={false} value={a} onChange={e=>setA(e.target.value)}/></label><label>Second<input ref={second} disabled={locked} value={b} onChange={e=>setB(e.target.value)}/></label><label>Lock target<input type="checkbox" checked={locked} onChange={e=>lock(e.target.checked)}/></label><button disabled={false} onClick={()=>focus(locked?other:target)}>Focus</button><button onClick={()=>{setB('');const ref=locked?other:target;ref.current.focus();}}>Clear</button></section>;
}
