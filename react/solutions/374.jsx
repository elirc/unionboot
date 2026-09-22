// 374 Tag editor with duplicate policy / scenario 1
// Input Tag and Add button. Trim values, reject empty and case-sensitive duplicates; cap2 tags. Clear input only on successful add. Each tag has Remove LABEL button.
// Run: node react/verify.cjs --id=374 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [text,set]=useState(''),[tags,save]=useState([]);function add(){const value=text.trim();if(!value||tags.length>=2||tags.some(x=>x===value))return;save(old=>[...old,value]);set('');}return <section><label>Tag<input value={text} onChange={e=>set(e.target.value)}/></label><button onClick={add}>Add</button><ul>{tags.map(tag=><li key={tag}>{tag}<button aria-label={'Remove '+tag} onClick={()=>save(old=>old.filter(x=>x!==tag))}>Remove</button></li>)}</ul></section>;}
