// 3277 Deferred resource display / scenario 19 — Boundary 9; defer suspended preview
// Controlled Text input updates immediately. Preview reads injected resource.read(text), which may throw a promise, inside Suspense fallback Waiting. Pass useDeferredValue(text) to preview, retaining previous visible content during suspense; Stale output yes while text differs from deferred value. Preview output echoes resource result. Resource for target9 is pending in tests. This is render-priority behavior, not debounce: no timer or request effect.
// Full prompt: ../prompts/3277.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({resource}) {
  // TODO: independently implement the prompt.
  return null;
}
