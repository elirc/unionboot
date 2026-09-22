// 2801 Reactive media query predicates / scenario 3 — Boundary 3; direct media match
// Call injected matchMedia with (min-width: 300px). Read .matches immediately; subscribe using addEventListener('change', listener) and remove the same listener on cleanup. Output Mode wide when true, compact when false. Matcher replacement must reread and resubscribe. No browser global matcher.
// Full prompt: ../prompts/2801.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({matchMedia}) {
  // TODO: independently implement the prompt.
  return null;
}
