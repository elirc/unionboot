// 1407 Combine category and minimum-rating filters [state]
// Props entries: {id,title,kind,stars}. A Kind select (all/kindA/kindB, initial all) filters by exact kind; a Stars select (all/2/3, initial all) keeps entries with stars >= value. Both filters combine. Output is matched count. List shows title only. Never mutate props; ordering stays as provided.
// Run: node react-junior/verify.cjs --id=1407 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({entries=[]}){const [kind,setKind]=useState('all'),[minStars,setMinStars]=useState('all');const filtered=entries.filter(x=>(kind==='all'||x.kind===kind)&&(minStars==='all'||x.stars>=Number(minStars)));
return <section><label>Kind<select value={kind} onChange={e=>setKind(e.target.value)}>{['all','kindA','kindB'].map(x=><option key={x}>{x}</option>)}</select></label><label>Stars<select value={minStars} onChange={e=>setMinStars(e.target.value)}>{['all','2','3'].map(x=><option key={x}>{x}</option>)}</select></label><ul>{filtered.map(x=><li key={x.id}>{x.title}</li>)}</ul><output>{filtered.length}</output></section>;}
