// 1417 Fix the lost selection on rerender [debugging / state]
// Debugging brief (blank starter): an index-based selection breaks when props reorder. Rebuild with stable ids. Requirement: keep the selection stable across item-list changes as long as the id still exists; if the id disappears, clear the selection (output None). Props items are {id,name}; selection via buttons labelled Pick NAME. Output shows the selected name or None.
// Run: node react-junior/verify.cjs --id=1417 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({items=[]}){const [selected,setSelected]=useState(null);useEffect(()=>{if(selected!==null&&!items.some(x=>x.id===selected))setSelected(null);},[items,selected]);const exists=selected!==null&&items.some(x=>x.id===selected);const current=exists?items.find(x=>x.id===selected).name:null;
return <section>{items.map(x=><button key={x.id} onClick={()=>setSelected(x.id)}>Pick {x.name}</button>)}<output>{selected===null?'None':exists?current:'None'}</output></section>;}
