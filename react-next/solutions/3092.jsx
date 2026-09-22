// 3092 Lazy panel mount lifetime / scenario 14 — Boundary 4; keep visited panels mounted
// Two tabs A/B with labelled tabpanels. Only A is initially mounted; B mounts on first visit. Each panel owns an uncontrolled Note A/B input initialized to seed4. Visited inactive panels remain mounted with hidden=true, preserving drafts and effects. Child effect calls onMount(name) and cleanup onUnmount(name). Tab aria-selected must track active; use matching tab/tabpanel IDs. This tests mount lifetime, beyond basic tab selection.
// Full prompt: ../prompts/3092.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function Panel({name,active,onMount,onUnmount}){useEffect(()=>{onMount(name);return()=>onUnmount(name);},[name,onMount,onUnmount]);return <div role="tabpanel" id={'panel-'+name} aria-labelledby={'tab-'+name} hidden={!active}><label>Note {name}<input defaultValue="seed4"/></label></div>;}
export default function Exercise({onMount,onUnmount}) {
const [active,set]=useState('A'),[visited,visit]=useState(['A']);return <section><div role="tablist">{['A','B'].map(name=><button key={name} role="tab" id={'tab-'+name} aria-controls={'panel-'+name} aria-selected={active===name} onClick={()=>{set(name);visit(xs=>xs.includes(name)?xs:[...xs,name]);}}>{name}</button>)}</div>{visited.map(name=><Panel key={name} name={name} active={active===name} onMount={onMount} onUnmount={onUnmount}/>)}</section>;
}
