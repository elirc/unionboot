// 2871 IME-safe command submission / scenario 13 — Boundary 3; commit at composition end
// Controlled Command field. During compositionStart..compositionEnd never commit on Enter; guard native isComposing too. Commit requires trimmed text length>=3, updates Saved and increments Commits. compositionEnd commits its final event target value once if valid; later Enter is a separate commit. Plain changes do not commit. Do not count intermediate IME strings.
// Full prompt: ../prompts/2871.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
