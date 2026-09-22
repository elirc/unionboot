// 1416 Immutable sorting / debugging variant [debugging / immutability]
// Props words is an array. A Sort button must render words sorted ascending WITHOUT mutating the props array (debugging brief: copying must replace an in-place .sort() call; starter is blank) and toggling Sort again restores the original order (original/ascending toggle). Sort button label Sort / Unsort. Output list shows words in current order. props.words must be untouched after all interactions.
// Run: node react-junior/verify.cjs --id=1416 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({words=[]}){const [sorted,setSorted]=useState(false);const shown=sorted?[...words].sort():[...words];
return <section><button onClick={()=>setSorted(s=>!s)}>{sorted?'Unsort':'Sort'}</button><ul>{shown.map((word,i)=><li key={word+'-'+i}>{word}</li>)}</ul></section>;}
