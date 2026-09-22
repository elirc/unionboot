// 678 Confirm destructive local action / scenario 10 — 6 records; remove all; phrase DELETE; case-sensitive; phrase only
// Local-only records count 6 in output. Delete opens dialog labelled Confirm removal and focuses Confirmation input. Confirm disabled until trimmed phrase equals DELETE (case-sensitive). Confirm removes all records, closes dialog and restores focus to Delete. Cancel or Escape closes without changing count. Reopening clears phrase/acknowledgment. Disable Delete at zero. No server actions.
// Prompt: ../prompts/678.txt
// Run from unionboot: node react-more/verify.cjs --id=678 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [count,set]=useState(6),[open,toggle]=useState(false),[text,change]=useState(''),[ack,agree]=useState(false);const field=useRef(null),trigger=useRef(null);useEffect(()=>{if(open)field.current.focus();},[open]);const close=()=>{toggle(false);trigger.current.focus();};const valid=text.trim()==="DELETE";return <section><output>{count}</output><button ref={trigger} disabled={count===0} onClick={()=>{change('');agree(false);toggle(true);}}>Delete</button>{open&&<div role="dialog" aria-label="Confirm removal" onKeyDown={e=>{if(e.key==='Escape')close();}}><label>Confirmation<input ref={field} value={text} onChange={e=>change(e.target.value)}/></label><button onClick={close}>Cancel</button><button disabled={!valid} onClick={()=>{if(valid){set(n=>Math.max(0,n-6));close();}}}>Confirm</button></div>}</section>;
}
