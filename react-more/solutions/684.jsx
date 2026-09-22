// 684 Reducer undoable text / scenario 6 — 2-entry bounded history; trim; reject blank commits
// Use useReducer for controlled Text history, initially 'start'. Normalize changes by trimming edges. Reject empty normalized strings. Identical normalized value does not create an entry. Retain at most 2 entries, dropping oldest. Undo/Redo navigate; new edit after undo drops redo. Output retained entry count. Clear history keeps the current text as the only entry. Buttons disable at boundaries.
// Prompt: ../prompts/684.txt
// Run from unionboot: node react-more/verify.cjs --id=684 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [s,dispatch]=useReducer((s,a)=>{if(a.type==='edit'){const value=a.value.trim();if(value===s.values[s.index]||value==='')return s;const values=[...s.values.slice(0,s.index+1),value].slice(-2);return {values,index:values.length-1};}if(a.type==='clear')return {values:[s.values[s.index]],index:0};if(a.type==='undo')return {...s,index:Math.max(0,s.index-1)};if(a.type==='redo')return {...s,index:Math.min(s.values.length-1,s.index+1)};return s;},{values:['start'],index:0});return <section><label>Text<input value={s.values[s.index]} onChange={e=>dispatch({type:'edit',value:e.target.value})}/></label><output>{s.values.length}</output><button disabled={s.index===0} onClick={()=>dispatch({type:'undo'})}>Undo</button><button disabled={s.index===s.values.length-1} onClick={()=>dispatch({type:'redo'})}>Redo</button><button onClick={()=>dispatch({type:'clear'})}>Clear history</button></section>;
}
