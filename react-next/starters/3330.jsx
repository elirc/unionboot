// 3330 Context menu anchor geometry / scenario 12 — Boundary 2; clamp menu inside viewport
// Contextmenu event on Target opens role=menu labelled Context. Prevent native menu. Menu size 10px square; use event clientX/clientY. Clamp left/top to [0,viewport dimension-menu size]. Position output left,top or closed. Render inline style left/top/width/height in px; width and height must both be 10, even for unbounded positioning. Escape on menu closes; another contextmenu repositions. No focus navigation or action items required: this is positioning/event behavior.
// Full prompt: ../prompts/3330.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({viewport={width:200,height:100}}) {
  // TODO: independently implement the prompt.
  return null;
}
