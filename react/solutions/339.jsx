// 339 Password visibility and length / scenario 1
// Controlled Password input, initially hidden. Show/Hide toggles type without clearing value. Output 'short' until length4, then 'ready'. Toggle must have type button.
// Run: node react/verify.cjs --id=339 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [text,set]=useState(''),[visible,toggle]=useState(false);return <section><label>Password<input type={visible?'text':'password'} value={text} onChange={e=>set(e.target.value)}/></label><button type="button" onClick={()=>toggle(x=>!x)}>{visible?'Hide':'Show'}</button><output>{text.length>=4?'ready':'short'}</output></section>;}
