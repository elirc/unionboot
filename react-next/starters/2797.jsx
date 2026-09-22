// 2797 Portal event ownership / scenario 19 — Boundary 9; stop React bubbling at portal child
// Use createPortal from react-dom to place a Send button in injected host, never in the render root. Each Send adds 9 to Local. Parent React section onClick adds one to Parent for bubbled clicks. Send stops propagation, so Parent stays unchanged. Local/Parent outputs stay in root. Changing host moves the portal without resetting counters. Unmount removes portal DOM, not the host.
// Full prompt: ../prompts/2797.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({host}) {
  // TODO: independently implement the prompt.
  return null;
}
