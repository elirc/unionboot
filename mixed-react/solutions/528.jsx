// 528 Validated text submission / scenario 5
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Controlled Name field. Submit disabled until trimmed name has at least 6 characters. Submit stores trimmed name in output and clears the field; empty output initially.
// Run: node mixed-react/verify.cjs --id=528 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [text,set]=useState(''),[saved,save]=useState('');return <form onSubmit={e=>{e.preventDefault();if(text.trim().length>=6){save(text.trim());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={text.trim().length<6}>Submit</button><output>{saved}</output></form>;}
