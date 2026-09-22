// 3367 Object URL preview ownership / scenario 9 — Boundary 9; retain last preview when blob absent
// Create preview object URL for blob prop with injected urlAPI, in an effect not render. Output URL string. Replacing blob revokes previous URL exactly once and creates next. When blob absent retain previous URL and keep it owned until next blob or unmount. Unmount revokes currently owned URL. Never revoke URLs that were not created here. Tests use blob size 9 as initial data.
// Full prompt: ../prompts/3367.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({blob,urlAPI}) {
  // TODO: independently implement the prompt.
  return null;
}
