// 2952 Document title lease hook / scenario 14 — Boundary 4; restore title only while lease still owns it
// Implement a renderless useTitleLease(title) hook: effect writes title prefixed 4 + ':', captures previous document.title, and cleans up on title change/unmount. Restore previous title only if the current document title is still this lease's written value (do not overwrite external changes). Exercise calls the hook and renders output Active title with the requested title. No global title mutation during render.
// Full prompt: ../prompts/2952.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function useTitleLease(title){useEffect(()=>{const before=document.title,written="4:"+title;document.title=written;return()=>{if(document.title===written)document.title=before;};},[title]);}
export default function Exercise({title="Working"}) {
useTitleLease(title);return <output aria-label="Active title">{title}</output>;
}
