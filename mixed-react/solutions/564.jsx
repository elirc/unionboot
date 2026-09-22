// 564 Confirm destructive local action / scenario 1
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Display 1 local records count in output. Delete opens labelled dialog 'Confirm removal'. Cancel closes without change; Confirm sets count0 and closes. No external operations. Delete disabled after count0.
// Run: node mixed-react/verify.cjs --id=564 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [count,set]=useState(1),[open,toggle]=useState(false);return <section><output>{count}</output><button disabled={!count} onClick={()=>toggle(true)}>Delete</button>{open&&<div role="dialog" aria-label="Confirm removal"><p>Remove local records?</p><button onClick={()=>toggle(false)}>Cancel</button><button onClick={()=>{set(0);toggle(false);}}>Confirm</button></div>}</section>;}
