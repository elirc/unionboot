// 3328 Context menu anchor geometry / scenario 10 — Boundary 10; preserve requested coordinates
// Contextmenu event on Target opens role=menu labelled Context. Prevent native menu. Menu size 50px square; use event clientX/clientY. Use event coordinates unchanged, even beyond viewport. Position output left,top or closed. Render inline style left/top/width/height in px; width and height must both be 50, even for unbounded positioning. Escape on menu closes; another contextmenu repositions. No focus navigation or action items required: this is positioning/event behavior.
// Full prompt: ../prompts/3328.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({viewport={width:200,height:100}}) {
  // TODO: independently implement the prompt.
  return null;
}
