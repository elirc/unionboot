// 2948 Document title lease hook / scenario 10 — Boundary 10; always restore previous title
// Implement a renderless useTitleLease(title) hook: effect writes title prefixed 10 + ':', captures previous document.title, and cleans up on title change/unmount. Always restore captured previous title, even after external changes. Exercise calls the hook and renders output Active title with the requested title. No global title mutation during render.
// Full prompt: ../prompts/2948.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function useTitleLease(title){useEffect(()=>{const before=document.title,written="10:"+title;document.title=written;return()=>{document.title=before;};},[title]);}
export default function Exercise({title="Working"}) {
useTitleLease(title);return <output aria-label="Active title">{title}</output>;
}
