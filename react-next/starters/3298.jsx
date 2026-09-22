// 3298 Imperative editor handle / scenario 20 — Boundary 10; handle reads trimmed draft
// Child Editor owns Draft input, initially 10 x characters. Expose focus(),read(),clear() via useImperativeHandle and a ref. Parent Focus calls child handle, Snapshot stores read() in Saved, Clear editor calls clear() without changing Saved. read returns trimmed text. Parent must not own a duplicate draft state. Each mounted editor ref must reference the current draft, not the initial closure.
// Full prompt: ../prompts/3298.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
