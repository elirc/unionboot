// 1377 Profile form with a saved baseline [forms]
// Props initialName (default Ada) initializes a saved baseline once per mount. Name input edits a draft. Save is disabled if trim is empty or equals saved name; Discard is disabled only when raw draft equals saved name. Save commits trimmed name, normalizes the field, and displays it in output. Discard restores the latest saved baseline, not the initial prop.
// Run: node react-junior/verify.cjs --id=1377 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialName='Ada'}){const [saved,setSaved]=useState(initialName),[draft,setDraft]=useState(initialName);
return <form onSubmit={e=>{e.preventDefault();if(draft.trim()&&draft.trim()!==saved){setSaved(draft.trim());setDraft(draft.trim());}}}><label>Name<input value={draft} onChange={e=>setDraft(e.target.value)}/></label><button disabled={!draft.trim()||draft.trim()===saved}>Save</button><button type="button" disabled={draft===saved} onClick={()=>setDraft(saved)}>Discard</button><output>{saved}</output></form>;}
