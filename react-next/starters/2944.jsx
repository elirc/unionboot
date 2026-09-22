// 2944 Document title lease hook / scenario 6 — Boundary 6; always restore previous title
// Implement a renderless useTitleLease(title) hook: effect writes title prefixed 6 + ':', captures previous document.title, and cleans up on title change/unmount. Always restore captured previous title, even after external changes. Exercise calls the hook and renders output Active title with the requested title. No global title mutation during render.
// Full prompt: ../prompts/2944.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({title="Working"}) {
  // TODO: independently implement the prompt.
  return null;
}
