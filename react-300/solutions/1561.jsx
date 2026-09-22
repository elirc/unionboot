// 1561 Cross-field pack orders / scenario 3 — Reserved buffer
// Units controlled text starts blank. Accept finite positive integers <=35 (40 capacity less 5 reserve), divisible by 5. Breakdown output shows P packs + R units, using pack size 5, or invalid. Submit disabled and guarded while invalid. Valid submit stores numeric units string in Saved without clearing input. Reset clears Units and Saved.
// Full prompt: ../prompts/1561.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [raw,set]=useState(''),[saved,save]=useState('');const n=Number(raw),valid=raw.trim()!==''&&Number.isFinite(n)&&Number.isInteger(n)&&n>0&&n<=35&&n%5===0;return <form onSubmit={e=>{e.preventDefault();if(valid)save(String(n));}}><label>Units<input value={raw} onChange={e=>set(e.target.value)}/></label><output aria-label="Breakdown">{valid?Math.floor(n/5)+' packs + '+n%5+' units':'invalid'}</output><output aria-label="Saved">{saved}</output><button disabled={!valid}>Submit</button><button type="button" onClick={()=>{set('');save('');}}>Reset</button></form>;
}
