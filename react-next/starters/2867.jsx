// 2867 IME-safe command submission / scenario 9 — Boundary 9; commit only on noncomposing Enter
// Controlled Command field. During compositionStart..compositionEnd never commit on Enter; guard native isComposing too. Commit requires trimmed text length>=9, updates Saved and increments Commits. compositionEnd updates draft only, then Enter commits. Plain changes do not commit. Do not count intermediate IME strings.
// Full prompt: ../prompts/2867.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
