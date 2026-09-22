// 3170 Connectivity capability gate / scenario 12 — Boundary 2; defer one latest action until online
// Read injected connection.read() on mount; subscribe to booleans. Sync action payload is 2. Output Network online/offline, Pending yes/no, Syncs count. Clicking Sync online calls onSync(2) immediately. Offline remember one pending action (coalesce repeated clicks), execute once on next online transition. Going online clears alert. Duplicate online events must not replay queued work. Unmount unsubscribes and cancels pending intent.
// Full prompt: ../prompts/3170.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({connection,onSync}) {
  // TODO: independently implement the prompt.
  return null;
}
