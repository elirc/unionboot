// 570 Reducer undoable text / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Text starts 'v1'. A controlled Text input commits each change as a history entry. Undo/Redo navigate entries; editing after Undo discards redo. Disable unavailable buttons. Implement useReducer.
// Run: node mixed-react/verify.cjs --id=570 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [s,dispatch]=useReducer((s,a)=>{if(a.type==='edit')return {values:[...s.values.slice(0,s.index+1),a.value],index:s.index+1};if(a.type==='undo')return {...s,index:Math.max(0,s.index-1)};return {...s,index:Math.min(s.values.length-1,s.index+1)};},{values:['v1'],index:0});return <section><label>Text<input value={s.values[s.index]} onChange={e=>dispatch({type:'edit',value:e.target.value})}/></label><button disabled={s.index===0} onClick={()=>dispatch({type:'undo'})}>Undo</button><button disabled={s.index===s.values.length-1} onClick={()=>dispatch({type:'redo'})}>Redo</button></section>;}
