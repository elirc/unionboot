// 1531 Shared quota allocation / scenario 3 — Sold-out pool
// A and B share 4 units, initially A=2, B=2. Take A/B requests 2; reject an entire request when free units are insufficient. Release A/B returns up to 2 owned units. Label outputs A, B, Free. Keep action buttons enabled, guard state updates. Reset restores initial counts.
// Full prompt: ../prompts/1531.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [s,set]=useState({A:2,B:2});const move=(w,take)=>set(old=>{const free=4-old.A-old.B;const n=take?free>=2?2:0:-Math.min(2,old[w]);return {...old,[w]:old[w]+n};});return <section>{['A','B'].map(w=><div key={w}><output aria-label={w}>{s[w]}</output><button onClick={()=>move(w,true)}>Take {w}</button><button onClick={()=>move(w,false)}>Release {w}</button></div>)}<output aria-label="Free">{4-s.A-s.B}</output><button onClick={()=>set({A:2,B:2})}>Reset</button></section>;
}
