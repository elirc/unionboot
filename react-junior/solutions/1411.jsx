// 1411 Lifted state between two panels [state]
// Two sibling panels share a single source of truth in the parent: Panel A (aria-label Editor) has a Note input; Panel B (aria-label Preview) mirrors it live. A Clear button (outside panels) empties the note. Character count output says N characters. Test verifies editing in A updates B without local copies drifting. Nothing but lifted state may hold the note.
// Run: node react-junior/verify.cjs --id=1411 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const [note,setNote]=useState('');
return <section><div role="group" aria-label="Editor"><label>Note<input value={note} onChange={e=>setNote(e.target.value)}/></label></div><div role="group" aria-label="Preview"><output>{note}</output></div><button onClick={()=>setNote('')}>Clear</button><output aria-label="Count">{note.length} characters</output></section>;}
