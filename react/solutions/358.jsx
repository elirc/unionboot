// 358 Keyboard escape cleanup / scenario 5
// Panel initially open, output 'open'/'closed'. Global document Escape key closes panel; Open reopens. Register listener in effect and remove on unmount. Other keys ignored. Label panel 'Panel 4'.
// Run: node react/verify.cjs --id=358 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [open,set]=useState(true);useEffect(()=>{const handler=e=>{if(e.key==='Escape')set(false);};document.addEventListener('keydown',handler);return ()=>document.removeEventListener('keydown',handler);},[]);return <section><output>{open?'open':'closed'}</output>{open&&<div aria-label="Panel 4">Panel content</div>}<button onClick={()=>set(true)}>Open</button></section>;}
