// 365 Ref focus controls / scenario 2
// Two labelled inputs First and Second. Focus button focuses Second; Clear empties both using controlled state and focuses First. Preserve entered text when focusing.
// Run: node react/verify.cjs --id=365 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [a,setA]=useState(''),[b,setB]=useState('');const first=useRef(null),second=useRef(null);return <section><label>First<input ref={first} value={a} onChange={e=>setA(e.target.value)}/></label><label>Second<input ref={second} value={b} onChange={e=>setB(e.target.value)}/></label><button onClick={()=>second.current.focus()}>Focus</button><button onClick={()=>{setA('');setB('');first.current.focus();}}>Clear</button></section>;}
