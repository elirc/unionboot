// 671 Editable label with cancel / scenario 13 — trim length 2..7; lower; unchanged cannot save
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and lowercases text; require 2..7 trimmed characters and a transformed result different from saved text. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/671.txt
// Run from unionboot: node react-more/verify.cjs --id=671 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [saved,save]=useState('Abc'),[draft,set]=useState(''),[editing,edit]=useState(false);const field=useRef(null),editButton=useRef(null),mounted=useRef(false);useEffect(()=>{if(editing)field.current.focus();else if(mounted.current)editButton.current.focus();mounted.current=true;},[editing]);const value=draft.trim().toLowerCase();const valid=value.length>=2&&value.length<=7&&value!==saved;return editing?<form onSubmit={e=>{e.preventDefault();if(valid){save(value);edit(false);}}}><label>Name<input ref={field} value={draft} onChange={e=>set(e.target.value)} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();edit(false);}else if(e.key==='Enter'){e.preventDefault();if(valid){save(value);edit(false);}}}}/></label><button disabled={!valid}>Save</button><button type="button" onClick={()=>edit(false)}>Cancel</button></form>:<section><output>{saved}</output><button ref={editButton} onClick={()=>{set(saved);edit(true);}}>Edit</button></section>;
}
