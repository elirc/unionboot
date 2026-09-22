// 718 Context preference provider / scenario 10 — quiet → verbose; initial quiet; Next + Reset; synchronized nested readers
// Create a module Context and nested reader/control children that consume it, no preference prop drilling. Choices quiet, verbose; initial quiet. Two nested outputs labelled Primary and Mirror always agree. Next cycles with wrap. Reset returns to the initial preference. Disable-lock checkbox labelled Locked prevents all preference-changing buttons without losing state; unlocking resumes. Separate mounted Exercise instances are isolated.
// Prompt: ../prompts/718.txt
// Run from unionboot: node react-more/verify.cjs --id=718 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
const Preference=React.createContext(null);function Reader({label}){const {value}=React.useContext(Preference);return <output aria-label={label}>{value}</output>;}function Controls(){const {move,locked,lock}=React.useContext(Preference);return <div><button disabled={locked} onClick={()=>move(1)}>Next</button><button disabled={locked} onClick={()=>move(0)}>Reset</button><label>Locked<input type="checkbox" checked={locked} onChange={e=>lock(e.target.checked)}/></label></div>;}
export default function Exercise({items=[], rows=[], load=async()=>''}) {
const choices=["quiet","verbose"];const [index,set]=useState(0),[locked,lock]=useState(false);const move=delta=>{if(!locked)set(i=>delta===0?0:(i+delta+choices.length)%choices.length);};return <Preference.Provider value={{value:choices[index],move,locked,lock}}><section><Reader label="Primary"/><div><Reader label="Mirror"/><Controls/></div></section></Preference.Provider>;
}
