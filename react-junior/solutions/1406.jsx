// 1406 Keyed list with prepend and remove [state / lists]
// Props initialNames is an ordered array of unique strings. A name input plus Add to top button prepends a trimmed nonempty unique name (case-insensitive uniqueness; reject silently if duplicate/empty). Each row has Remove X. Row numbers 1..N render before each name inside the listitem. New names must appear at index 0 with correct renumbering. Output count. Never reuse key-based DOM identity incorrectly: keys must be the name string.
// Run: node react-junior/verify.cjs --id=1406 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialNames=[]}){const [names,setNames]=useState(()=>[...initialNames]);const [text,setText]=useState('');
const add=()=>{const value=text.trim();if(!value)return;if(names.some(x=>x.toLowerCase()===value.toLowerCase()))return;setNames(old=>[value,...old]);setText('');};
return <section><label>New name<input value={text} onChange={e=>setText(e.target.value)}/></label><button onClick={add}>Add to top</button><ol>{names.map((name,i)=><li key={name}><span>{i+1}</span> {name}<button aria-label={'Remove '+name} onClick={()=>setNames(old=>old.filter(x=>x!==name))}>x</button></li>)}</ol><output>{names.length}</output></section>;}
