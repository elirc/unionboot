// 1560 Cross-field pack orders / scenario 2 — Loose units
// Units controlled text starts blank. Accept finite positive integers <=30 (30 capacity). Breakdown output shows P packs + R units, using pack size 6, or invalid. Submit disabled and guarded while invalid. Valid submit stores numeric units string in Saved without clearing input. Reset clears Units and Saved.
// Full prompt: ../prompts/1560.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [raw,set]=useState(''),[saved,save]=useState('');const n=Number(raw),valid=raw.trim()!==''&&Number.isFinite(n)&&Number.isInteger(n)&&n>0&&n<=30;return <form onSubmit={e=>{e.preventDefault();if(valid)save(String(n));}}><label>Units<input value={raw} onChange={e=>set(e.target.value)}/></label><output aria-label="Breakdown">{valid?Math.floor(n/6)+' packs + '+n%6+' units':'invalid'}</output><output aria-label="Saved">{saved}</output><button disabled={!valid}>Submit</button><button type="button" onClick={()=>{set('');save('');}}>Reset</button></form>;
}
