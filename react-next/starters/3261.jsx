// 3261 Deferred resource display / scenario 3 — Boundary 3; urgent suspended preview
// Controlled Text input updates immediately. Preview reads injected resource.read(text), which may throw a promise, inside Suspense fallback Waiting. Pass current text directly: preview suspends urgently; Stale output always no. Preview output echoes resource result. Resource for target3 is pending in tests. This is render-priority behavior, not debounce: no timer or request effect.
// Full prompt: ../prompts/3261.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({resource}) {
  // TODO: independently implement the prompt.
  return null;
}
