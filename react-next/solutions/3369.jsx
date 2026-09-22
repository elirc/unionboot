// 3369 Object URL preview ownership / scenario 11 — Boundary 1; clear preview when no blob
// Create preview object URL for blob prop with injected urlAPI, in an effect not render. Output URL string. Replacing blob revokes previous URL exactly once and creates next. When blob absent revoke previous and show empty. Unmount revokes currently owned URL. Never revoke URLs that were not created here. Tests use blob size 1 as initial data.
// Full prompt: ../prompts/3369.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({blob,urlAPI}) {
const [url,set]=useState(''),owned=useRef(null);useEffect(()=>{if(!blob){if(owned.current){urlAPI.revokeObjectURL(owned.current);owned.current=null;}set('');return;}if(!blob)return;if(owned.current)urlAPI.revokeObjectURL(owned.current);owned.current=urlAPI.createObjectURL(blob);set(owned.current);},[blob,urlAPI]);useEffect(()=>()=>{if(owned.current){urlAPI.revokeObjectURL(owned.current);owned.current=null;}},[urlAPI]);return <output aria-label="URL">{url}</output>;
}
