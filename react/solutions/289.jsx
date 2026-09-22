// 289 Validated text submission / scenario 1
// Controlled Name field. Submit disabled until trimmed name has at least 2 characters. Submit stores trimmed name in output and clears the field; empty output initially.
// Run: node react/verify.cjs --id=289 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [text,set]=useState(''),[saved,save]=useState('');return <form onSubmit={e=>{e.preventDefault();if(text.trim().length>=2){save(text.trim());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={text.trim().length<2}>Submit</button><output>{saved}</output></form>;}
