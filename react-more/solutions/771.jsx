// 771 Tag editor with duplicate policy / scenario 13 — cap 3; maximum 6 chars; case-sensitive duplicates; sorted display
// Tag input, Add submits a form (Enter also submits), list tags as text plus Remove LABEL button. Trim tags; reject blank, tags longer than 6, case-sensitive duplicates, and additions above cap 3. Role alert says empty/long/duplicate/full in that priority. Successful add clears input and error; invalid leaves input unchanged. Display case-sensitive code-unit ascending order (do not reorder stored history). Removal clears error; Clear all clears tags/error but preserves draft. Output remaining capacity.
// Prompt: ../prompts/771.txt
// Run from unionboot: node react-more/verify.cjs --id=771 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[tags,save]=useState([]),[error,fail]=useState('');function add(){const value=text.trim();const error=!value?'empty':value.length>6?'long':tags.some(x=>x===value)?'duplicate':tags.length>=3?'full':'';fail(error);if(!error){save(old=>[...old,value]);set('');}}return <section><form onSubmit={e=>{e.preventDefault();add();}}><label>Tag<input value={text} onChange={e=>set(e.target.value)}/></label><button>Add</button></form>{error&&<p role="alert">{error}</p>}<ul>{[...tags].sort().map(tag=><li key={tag}><span>{tag}</span><button aria-label={'Remove '+tag} onClick={()=>{save(old=>old.filter(x=>x!==tag));fail('');}}>Remove</button></li>)}</ul><button onClick={()=>{save([]);fail('');}}>Clear all</button><output>{3-tags.length}</output></section>;
}
