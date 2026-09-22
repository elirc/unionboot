// 327 Editable label with cancel / scenario 4
// Initially show label 'Draft 3'. Edit opens Name input initialized from saved value. Save trims and commits only nonempty input; Cancel discards draft. Enter submits; Escape cancels.
// Run: node react/verify.cjs --id=327 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [saved,save]=useState('Draft 3'),[draft,set]=useState(''),[editing,edit]=useState(false);return editing?<form onSubmit={e=>{e.preventDefault();if(draft.trim()){save(draft.trim());edit(false);}}}><label>Name<input value={draft} onChange={e=>set(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')edit(false);}}/></label><button disabled={!draft.trim()}>Save</button><button type="button" onClick={()=>edit(false)}>Cancel</button></form>:<section><output>{saved}</output><button onClick={()=>{set(saved);edit(true);}}>Edit</button></section>;}
