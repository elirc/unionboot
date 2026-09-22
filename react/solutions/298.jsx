// 298 Filtered product list / scenario 5
// Show props.items strings in a list; Search is case-insensitive substring search. Trim the query. Empty query shows all. Show count in output; never mutate items.
// Run: node react/verify.cjs --id=298 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [q,set]=useState('');const query=q.trim().toLowerCase();const filtered=items.filter(x=>x.toLowerCase().includes(query));return <section><label>Search<input value={q} onChange={e=>set(e.target.value)}/></label><output>{filtered.length}</output><ul>{filtered.map((x,i)=><li key={i}>{x}</li>)}</ul></section>;}
