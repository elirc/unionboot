// 3216 URL query writeback / scenario 18 — Boundary 8; replace history entry
// Read injected history.read() query string; Query field uses parameter q, default empty. Editing writes q using URLSearchParams, preserves unrelated parameters, deletes q when empty, and calls history.replace(search) with leading ? (or empty if no parameters). Subscribe to pop notifications and reread without writing back. Initial query is seed8. Cleanup subscription.
// Full prompt: ../prompts/3216.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({history}) {
  // TODO: independently implement the prompt.
  return null;
}
