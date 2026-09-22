// 3092 Lazy panel mount lifetime / scenario 14 — Boundary 4; keep visited panels mounted
// Two tabs A/B with labelled tabpanels. Only A is initially mounted; B mounts on first visit. Each panel owns an uncontrolled Note A/B input initialized to seed4. Visited inactive panels remain mounted with hidden=true, preserving drafts and effects. Child effect calls onMount(name) and cleanup onUnmount(name). Tab aria-selected must track active; use matching tab/tabpanel IDs. This tests mount lifetime, beyond basic tab selection.
// Full prompt: ../prompts/3092.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({onMount,onUnmount}) {
  // TODO: independently implement the prompt.
  return null;
}
