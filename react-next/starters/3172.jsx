// 3172 Connectivity capability gate / scenario 14 — Boundary 4; defer one latest action until online
// Read injected connection.read() on mount; subscribe to booleans. Sync action payload is 4. Output Network online/offline, Pending yes/no, Syncs count. Clicking Sync online calls onSync(4) immediately. Offline remember one pending action (coalesce repeated clicks), execute once on next online transition. Going online clears alert. Duplicate online events must not replay queued work. Unmount unsubscribes and cancels pending intent.
// Full prompt: ../prompts/3172.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({connection,onSync}) {
  // TODO: independently implement the prompt.
  return null;
}
