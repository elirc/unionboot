// 3238 Opaque cursor history cache / scenario 20 — Boundary 10; cache forward page after back
// Load first calls injected loadPage(null). Promise resolves {text,next}; next is opaque cursor or null. Show Page text and Next/Back buttons. Next calls loadPage(next), Back shows previous resolved page without network. Forward pages are cached by cursor and reused after Back. Buttons disabled during pending; Load first resets history. Page initially empty, Busy yes/no. On rejection retain current page and alert Page failed; retry clears alert. Ignore completion after unmount. Tests use cursor token token-10.
// Full prompt: ../prompts/3238.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({loadPage}) {
  // TODO: independently implement the prompt.
  return null;
}
