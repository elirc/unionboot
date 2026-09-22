// 2953 Document title lease hook / scenario 15 — Boundary 5; restore title only while lease still owns it
// Implement a renderless useTitleLease(title) hook: effect writes title prefixed 5 + ':', captures previous document.title, and cleans up on title change/unmount. Restore previous title only if the current document title is still this lease's written value (do not overwrite external changes). Exercise calls the hook and renders output Active title with the requested title. No global title mutation during render.
// Full prompt: ../prompts/2953.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({title="Working"}) {
  // TODO: independently implement the prompt.
  return null;
}
