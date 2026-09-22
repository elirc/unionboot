// 770 Tag editor with duplicate policy / scenario 12 — cap 2; maximum 5 chars; case-insensitive duplicates; sorted display
// Tag input, Add submits a form (Enter also submits), list tags as text plus Remove LABEL button. Trim tags; reject blank, tags longer than 5, case-insensitive duplicates, and additions above cap 2. Role alert says empty/long/duplicate/full in that priority. Successful add clears input and error; invalid leaves input unchanged. Display case-sensitive code-unit ascending order (do not reorder stored history). Removal clears error; Clear all clears tags/error but preserves draft. Output remaining capacity.
// Prompt: ../prompts/770.txt
// Run from unionboot: node react-more/verify.cjs --id=770 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[tags,save]=useState([]),[error,fail]=useState('');function add(){const value=text.trim();const error=!value?'empty':value.length>5?'long':tags.some(x=>x.toLowerCase()===value.toLowerCase())?'duplicate':tags.length>=2?'full':'';fail(error);if(!error){save(old=>[...old,value]);set('');}}return <section><form onSubmit={e=>{e.preventDefault();add();}}><label>Tag<input value={text} onChange={e=>set(e.target.value)}/></label><button>Add</button></form>{error&&<p role="alert">{error}</p>}<ul>{[...tags].sort().map(tag=><li key={tag}><span>{tag}</span><button aria-label={'Remove '+tag} onClick={()=>{save(old=>old.filter(x=>x!==tag));fail('');}}>Remove</button></li>)}</ul><button onClick={()=>{save([]);fail('');}}>Clear all</button><output>{2-tags.length}</output></section>;
}
