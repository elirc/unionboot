// 1537 Shared quota allocation / scenario 9 — Release only owned units
// A and B share 9 units, initially A=1, B=4. Take A/B requests 3; take remaining free units for oversized requests. Release A/B returns up to 3 owned units. Label outputs A, B, Free. Keep action buttons enabled, guard state updates. Reset restores initial counts.
// Full prompt: ../prompts/1537.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [s,set]=useState({A:1,B:4});const move=(w,take)=>set(old=>{const free=9-old.A-old.B;const n=take?Math.min(3,free):-Math.min(3,old[w]);return {...old,[w]:old[w]+n};});return <section>{['A','B'].map(w=><div key={w}><output aria-label={w}>{s[w]}</output><button onClick={()=>move(w,true)}>Take {w}</button><button onClick={()=>move(w,false)}>Release {w}</button></div>)}<output aria-label="Free">{9-s.A-s.B}</output><button onClick={()=>set({A:1,B:4})}>Reset</button></section>;
}
