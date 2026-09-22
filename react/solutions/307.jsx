// 307 Accessible tab selection / scenario 4
// Three tabs Red,Green,Blue, initial 0. Click or ArrowRight/ArrowLeft selects and focuses a tab, wrapping at ends. Expose tablist, tab, aria-selected and one tabpanel. Roving tabIndex.
// Run: node react/verify.cjs --id=307 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [index,set]=useState(0);const refs=useRef([]);const names=['Red','Green','Blue'];return <section><div role="tablist">{names.map((name,i)=><button key={name} ref={el=>{refs.current[i]=el;}} role="tab" tabIndex={index===i?0:-1} aria-selected={index===i} onClick={()=>set(i)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:2))%3;set(next);refs.current[next].focus();}}}>{name}</button>)}</div><div role="tabpanel">{names[index]}</div></section>;}
