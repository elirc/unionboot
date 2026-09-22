// 3438 Selection-aware text formatting / scenario 20 — Boundary 10; wrap selected text in brackets
// Text textarea starts aaaaaaaaaabc. Format operates on current DOM selection. Wrap nonempty selected text in [brackets]. Empty selection leaves text unchanged and shows alert Select text. On success clear alert and restore selection around transformed text via layout effect; do not select surrounding text. Output Text mirrors draft. Plain typing is unmodified. This is selection/caret management, not clipboard access.
// Full prompt: ../prompts/3438.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
