// 3001 Virtual window slicing / scenario 3 — Boundary 3; visible rows only
// Render data-testid=viewport; fixed row height 10px, visible capacity 4. onScroll derives first visible index floor(max(0,scrollTop)/10), clamped so a full final window remains (or zero for short lists). Render only slice [first-0,first+4+0), clipped to data. Outputs Start (zero-based rendered start), End (exclusive), Offset (start*10). Each listitem must have aria-posinset originalIndex+1 and aria-setsize full length. Prop shrink clamps immediately. This exercise tests virtualization math, not actual jsdom scrolling/layout.
// Full prompt: ../prompts/3001.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
