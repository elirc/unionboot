// 2934 Compound field registration / scenario 16 — Boundary 6; fieldset disables registered inputs
// Build compound FieldRoot, FieldInput and FieldSummary components sharing context rather than prop drilling. Root registers descendant field IDs on mount and unregisters on unmount; duplicate IDs are outside contract. Render 6 inputs initially, each labelled Field 1..6, and Registered output with count. Add field mounts one more; Remove field unmounts last but never below zero. Toggle disabled toggles context disabled state; all inputs inherit it. Counts must reflect actual mounted inputs, not a second hardcoded counter.
// Full prompt: ../prompts/2934.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
const Fields=React.createContext(null);
function FieldRoot({children}){const [ids,set]=useState([]),[disabled,toggle]=useState(false);const register=useCallback(id=>{set(xs=>[...xs,id]);return()=>set(xs=>xs.filter(x=>x!==id));},[]);return <Fields.Provider value={{ids,disabled,register}}><button onClick={()=>toggle(x=>!x)}>Toggle disabled</button><output aria-label="Disabled">{disabled?'yes':'no'}</output>{children}</Fields.Provider>;}
function FieldInput({id}){const {register,disabled}=useContext(Fields);useEffect(()=>register(id),[id,register]);return <label>Field {id}<input disabled={disabled}/></label>;}
function FieldSummary(){return <output aria-label="Registered">{useContext(Fields).ids.length}</output>;}
export default function Exercise({}) {
const [count,set]=useState(6);return <FieldRoot><FieldSummary/>{Array.from({length:count},(_,i)=><FieldInput key={i+1} id={i+1}/>)}<button onClick={()=>set(x=>x+1)}>Add field</button><button onClick={()=>set(x=>Math.max(0,x-1))}>Remove field</button></FieldRoot>;
}
