// 300 Exclusive accordion / scenario 2
// Three sections One,Two,Three, initially section 2 open. Buttons expose aria-expanded, opening another closes previous; clicking current closes it. Content is unmounted while closed.
// Run: node react/verify.cjs --id=300 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [open,set]=useState(1);return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} onClick={()=>set(x=>x===i?null:i)}>{name}</button>{open===i&&<p>{name} content</p>}</div>)}</section>;}
