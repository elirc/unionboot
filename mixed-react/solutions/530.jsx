// 530 Filtered product list / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Show props.items strings in a list; Search is case-insensitive prefix search. Preserve query whitespace. Empty query shows all. Show count in output; never mutate items.
// Run: node mixed-react/verify.cjs --id=530 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [q,set]=useState('');const query=q.toLowerCase();const filtered=items.filter(x=>x.toLowerCase().startsWith(query));return <section><label>Search<input value={q} onChange={e=>set(e.target.value)}/></label><output>{filtered.length}</output><ul>{filtered.map((x,i)=><li key={i}>{x}</li>)}</ul></section>;}
