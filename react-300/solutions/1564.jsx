// 1564 Cross-field pack orders / scenario 6 — Large minimum shipment
// Units controlled text starts blank. Accept finite positive integers <=90 (100 capacity less 10 reserve), divisible by 10. Breakdown output shows P packs + R units, using pack size 10, or invalid. Submit disabled and guarded while invalid. Valid submit stores numeric units string in Saved without clearing input. Reset clears Units and Saved.
// Full prompt: ../prompts/1564.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const [raw,set]=useState(''),[saved,save]=useState('');const n=Number(raw),valid=raw.trim()!==''&&Number.isFinite(n)&&Number.isInteger(n)&&n>0&&n<=90&&n%10===0;return <form onSubmit={e=>{e.preventDefault();if(valid)save(String(n));}}><label>Units<input value={raw} onChange={e=>set(e.target.value)}/></label><output aria-label="Breakdown">{valid?Math.floor(n/10)+' packs + '+n%10+' units':'invalid'}</output><output aria-label="Saved">{saved}</output><button disabled={!valid}>Submit</button><button type="button" onClick={()=>{set('');save('');}}>Reset</button></form>;
}
