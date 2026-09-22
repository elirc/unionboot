// 3316 Paste replacement transaction / scenario 18 — Boundary 8; uppercase pasted text
// Draft textarea starts abcdef. Intercept paste using clipboardData.getData('text/plain'), remove CR/LF, uppercase, truncate PASTED text to 8 characters, and replace current selection (selectionStart..selectionEnd), leaving unselected text untouched. Prevent default and restore caret just after inserted text using a layout effect. Changes by ordinary typing stay untouched. Output Text echoes full draft.
// Full prompt: ../prompts/3316.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
