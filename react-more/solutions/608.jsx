// 608 Filtered product list / scenario 10 — startsWith, case-folded, trim, retain duplicates, limit 2
// Render props.items strings in a list. Search uses startsWith, case-insensitive matching; trim query. Keep duplicate items. Show at most 2 matches after filtering/deduplication. Output visible count, not total matches. Empty query matches all. Preserve input order and props; respond to updated props.
// Prompt: ../prompts/608.txt
// Run from unionboot: node react-more/verify.cjs --id=608 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [q,set]=useState('');let query=q.trim();query=query.toLowerCase();let matches=items.filter(x=>(x.toLowerCase()).startsWith(query));matches=matches.slice(0,2);return <section><label>Search<input value={q} onChange={e=>set(e.target.value)}/></label><output>{matches.length}</output><ul>{matches.map((x,i)=><li key={i}>{x}</li>)}</ul></section>;
}
