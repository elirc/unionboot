// 1374 Three-state stable sorting [state]
// Variant of a sortable list: Score cycles original -> ascending -> descending -> original. Props rows are {id,name,score}. Render names in listitems. Ties retain original order even descending; do not mutate props. One output says original/ascending/descending. New rows from a rerender must be reflected without resetting the active sort mode.
// Run: node react-junior/verify.cjs --id=1374 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({rows=[]}){const [mode,setMode]=useState(0);
const ordered=rows.map((row,index)=>({row,index}));if(mode)ordered.sort((a,b)=>(mode===1?a.row.score-b.row.score:b.row.score-a.row.score)||a.index-b.index);
return <section><button onClick={()=>setMode(m=>(m+1)%3)}>Score</button><output>{['original','ascending','descending'][mode]}</output><ul>{ordered.map(({row})=><li key={row.id}>{row.name}</li>)}</ul></section>;}
