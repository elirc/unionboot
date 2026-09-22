// 606 Filtered product list / scenario 8 — endsWith, case-folded, trim, retain duplicates, limit none
// Render props.items strings in a list. Search uses endsWith, case-insensitive matching; trim query. Keep duplicate items. Show every match. Output visible count, not total matches. Empty query matches all. Preserve input order and props; respond to updated props.
// Prompt: ../prompts/606.txt
// Run from unionboot: node react-more/verify.cjs --id=606 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [q,set]=useState('');let query=q.trim();query=query.toLowerCase();let matches=items.filter(x=>(x.toLowerCase()).endsWith(query));return <section><label>Search<input value={q} onChange={e=>set(e.target.value)}/></label><output>{matches.length}</output><ul>{matches.map((x,i)=><li key={i}>{x}</li>)}</ul></section>;
}
