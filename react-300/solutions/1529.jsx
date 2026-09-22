// 1529 Shared quota allocation / scenario 1 — Reserve final ticket
// A and B share 5 units, initially A=1, B=1. Take A/B requests 1; reject an entire request when free units are insufficient. Release A/B returns up to 1 owned units. Label outputs A, B, Free. Keep action buttons enabled, guard state updates. Reset restores initial counts.
// Full prompt: ../prompts/1529.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [s,set]=useState({A:1,B:1});const move=(w,take)=>set(old=>{const free=5-old.A-old.B;const n=take?free>=1?1:0:-Math.min(1,old[w]);return {...old,[w]:old[w]+n};});return <section>{['A','B'].map(w=><div key={w}><output aria-label={w}>{s[w]}</output><button onClick={()=>move(w,true)}>Take {w}</button><button onClick={()=>move(w,false)}>Release {w}</button></div>)}<output aria-label="Free">{5-s.A-s.B}</output><button onClick={()=>set({A:1,B:1})}>Reset</button></section>;
}
