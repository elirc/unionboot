// 3289 Imperative editor handle / scenario 11 — Boundary 1; handle reads trimmed draft
// Child Editor owns Draft input, initially 1 x characters. Expose focus(),read(),clear() via useImperativeHandle and a ref. Parent Focus calls child handle, Snapshot stores read() in Saved, Clear editor calls clear() without changing Saved. read returns trimmed text. Parent must not own a duplicate draft state. Each mounted editor ref must reference the current draft, not the initial closure.
// Full prompt: ../prompts/3289.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
