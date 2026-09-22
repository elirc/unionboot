// 2988 Shared promise resource cache / scenario 10 — Boundary 10; evict rejected cache entry
// Exercise owns a Map of promise entries keyed by resource. Two buttons Load left/Load right request the same key K10 using injected pool.load(key). Deduplicate pending and fulfilled promises: a shared request can populate both outputs Left/Right. Each output begins idle, becomes loading, then response string or error. Evict a rejected entry so next click retries. Invalidate deletes key cache without changing displayed values. No fetching on mount; ignore completions after unmount.
// Full prompt: ../prompts/2988.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({pool}) {
  // TODO: independently implement the prompt.
  return null;
}
