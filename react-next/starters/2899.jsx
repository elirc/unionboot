// 2899 Coalesced live announcements / scenario 1 — Boundary 1; announce latest in burst
// Subscribe injected source messages (strings). First message in a burst opens a fixed 50ms window using scheduler.after; subsequent messages do not reschedule it. On expiry announce only last burst message in role=status aria-label=Announcement with aria-live=polite and aria-atomic=true. Initially empty. Clear cancels pending burst and empties text. Guard stale scheduled callbacks and clean up both services on unmount. This is announcement batching, not a debounced text draft.
// Full prompt: ../prompts/2899.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({source,scheduler}) {
  // TODO: independently implement the prompt.
  return null;
}
