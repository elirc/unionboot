// 3226 Opaque cursor history cache / scenario 8 — Boundary 8; refetch forward page after back
// Load first calls injected loadPage(null). Promise resolves {text,next}; next is opaque cursor or null. Show Page text and Next/Back buttons. Next calls loadPage(next), Back shows previous resolved page without network. Next always refetches, even a previously visited cursor. Buttons disabled during pending; Load first resets history. Page initially empty, Busy yes/no. On rejection retain current page and alert Page failed; retry clears alert. Ignore completion after unmount. Tests use cursor token token-8.
// Full prompt: ../prompts/3226.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({loadPage}) {
  // TODO: independently implement the prompt.
  return null;
}
