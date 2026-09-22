// 605 Filtered product list / scenario 7 — startsWith, case-folded, literal spaces, retain duplicates, limit none
// Render props.items strings in a list. Search uses startsWith, case-insensitive matching; preserve query whitespace. Keep duplicate items. Show every match. Output visible count, not total matches. Empty query matches all. Preserve input order and props; respond to updated props.
// Prompt: ../prompts/605.txt
// Run from unionboot: node react-more/verify.cjs --id=605 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [q,set]=useState('');let query=q;query=query.toLowerCase();let matches=items.filter(x=>(x.toLowerCase()).startsWith(query));return <section><label>Search<input value={q} onChange={e=>set(e.target.value)}/></label><output>{matches.length}</output><ul>{matches.map((x,i)=><li key={i}>{x}</li>)}</ul></section>;
}
