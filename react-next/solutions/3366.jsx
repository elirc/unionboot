// 3366 Object URL preview ownership / scenario 8 — Boundary 8; retain last preview when blob absent
// Create preview object URL for blob prop with injected urlAPI, in an effect not render. Output URL string. Replacing blob revokes previous URL exactly once and creates next. When blob absent retain previous URL and keep it owned until next blob or unmount. Unmount revokes currently owned URL. Never revoke URLs that were not created here. Tests use blob size 8 as initial data.
// Full prompt: ../prompts/3366.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({blob,urlAPI}) {
const [url,set]=useState(''),owned=useRef(null);useEffect(()=>{if(!blob&&owned.current){return;}if(!blob)return;if(owned.current)urlAPI.revokeObjectURL(owned.current);owned.current=urlAPI.createObjectURL(blob);set(owned.current);},[blob,urlAPI]);useEffect(()=>()=>{if(owned.current){urlAPI.revokeObjectURL(owned.current);owned.current=null;}},[urlAPI]);return <output aria-label="URL">{url}</output>;
}
