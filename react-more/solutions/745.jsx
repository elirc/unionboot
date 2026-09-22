// 745 Ref focus controls / scenario 7 — focus Second; clear both; caret at end; disable focus when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables Second. Focus button is disabled when target is locked. Focusing moves caret to end without changing either value. Clear empties both inputs, then focuses First if enabled, otherwise Second. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/745.txt
// Run from unionboot: node react-more/verify.cjs --id=745 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [a,setA]=useState('alpha'),[b,setB]=useState('beta'),[locked,lock]=useState(false);const first=useRef(null),second=useRef(null);const target=second,other=first;function focus(ref){ref.current.focus();const n=ref.current.value.length;ref.current.setSelectionRange(n,n);}return <section><label>First<input ref={first} disabled={false} value={a} onChange={e=>setA(e.target.value)}/></label><label>Second<input ref={second} disabled={locked} value={b} onChange={e=>setB(e.target.value)}/></label><label>Lock target<input type="checkbox" checked={locked} onChange={e=>lock(e.target.checked)}/></label><button disabled={locked} onClick={()=>focus(locked?other:target)}>Focus</button><button onClick={()=>{setA('');setB('');const ref=first.current.disabled?second:first;ref.current.focus();}}>Clear</button></section>;
}
