// 1536 Shared quota allocation / scenario 8 — Oversized partial batch
// A and B share 5 units, initially A=0, B=0. Take A/B requests 6; take remaining free units for oversized requests. Release A/B returns up to 6 owned units. Label outputs A, B, Free. Keep action buttons enabled, guard state updates. Reset restores initial counts.
// Full prompt: ../prompts/1536.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [s,set]=useState({A:0,B:0});const move=(w,take)=>set(old=>{const free=5-old.A-old.B;const n=take?Math.min(6,free):-Math.min(6,old[w]);return {...old,[w]:old[w]+n};});return <section>{['A','B'].map(w=><div key={w}><output aria-label={w}>{s[w]}</output><button onClick={()=>move(w,true)}>Take {w}</button><button onClick={()=>move(w,false)}>Release {w}</button></div>)}<output aria-label="Free">{5-s.A-s.B}</output><button onClick={()=>set({A:0,B:0})}>Reset</button></section>;
}
