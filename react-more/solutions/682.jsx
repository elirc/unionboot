// 682 Confirm destructive local action / scenario 14 — 10 records; remove all; phrase remove; case-sensitive; acknowledgment required
// Local-only records count 10 in output. Delete opens dialog labelled Confirm removal and focuses Confirmation input. Confirm disabled until trimmed phrase equals remove (case-sensitive) and I understand checkbox is checked. Confirm removes all records, closes dialog and restores focus to Delete. Cancel or Escape closes without changing count. Reopening clears phrase/acknowledgment. Disable Delete at zero. No server actions.
// Prompt: ../prompts/682.txt
// Run from unionboot: node react-more/verify.cjs --id=682 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [count,set]=useState(10),[open,toggle]=useState(false),[text,change]=useState(''),[ack,agree]=useState(false);const field=useRef(null),trigger=useRef(null);useEffect(()=>{if(open)field.current.focus();},[open]);const close=()=>{toggle(false);trigger.current.focus();};const valid=text.trim()==="remove"&&ack;return <section><output>{count}</output><button ref={trigger} disabled={count===0} onClick={()=>{change('');agree(false);toggle(true);}}>Delete</button>{open&&<div role="dialog" aria-label="Confirm removal" onKeyDown={e=>{if(e.key==='Escape')close();}}><label>Confirmation<input ref={field} value={text} onChange={e=>change(e.target.value)}/></label><label>I understand<input type="checkbox" checked={ack} onChange={e=>agree(e.target.checked)}/></label><button onClick={close}>Cancel</button><button disabled={!valid} onClick={()=>{if(valid){set(n=>Math.max(0,n-10));close();}}}>Confirm</button></div>}</section>;
}
