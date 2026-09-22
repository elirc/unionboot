// 1371 Reducer match scoreboard [state]
// Build a useReducer scoreboard with Red and Blue scores initially 0. Goal Red / Goal Blue increment that team. Output labelled Score reads RED:BLUE. End match freezes scoring and changes status labelled Match from playing to final. New match resets both scores and resumes play. Disable goal and End match buttons after ending.
// Run: node react-junior/verify.cjs --id=1371 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const [s,dispatch]=useReducer((s,a)=>a==='reset'?{red:0,blue:0,final:false}:s.final?s:a==='end'?{...s,final:true}:{...s,[a]:s[a]+1},{red:0,blue:0,final:false});
return <section><output aria-label="Score">{s.red}:{s.blue}</output><output aria-label="Match">{s.final?'final':'playing'}</output><button disabled={s.final} onClick={()=>dispatch('red')}>Goal Red</button><button disabled={s.final} onClick={()=>dispatch('blue')}>Goal Blue</button><button disabled={s.final} onClick={()=>dispatch('end')}>End match</button><button onClick={()=>dispatch('reset')}>New match</button></section>;}
