// 2913 Coalesced live announcements / scenario 15 — Boundary 5; announce joined burst
// Subscribe injected source messages (strings). First message in a burst opens a fixed 250ms window using scheduler.after; subsequent messages do not reschedule it. On expiry announce all burst messages joined by / in role=status aria-label=Announcement with aria-live=polite and aria-atomic=true. Initially empty. Clear cancels pending burst and empties text. Guard stale scheduled callbacks and clean up both services on unmount. This is announcement batching, not a debounced text draft.
// Full prompt: ../prompts/2913.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({source,scheduler}) {
  // TODO: independently implement the prompt.
  return null;
}
