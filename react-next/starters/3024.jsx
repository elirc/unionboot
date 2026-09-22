// 3024 Socket handshake and buffered sends / scenario 6 — Boundary 6; reject offline sends
// Injected socket.subscribe receives {type:'open'|'close'|'message',data?}, returns cleanup. State starts closed. Send button sends incrementing strings starting m7 (sequence baseline 6) when open. While closed reject all sends. Rejected attempts do not consume message numbers. On open drain queued messages once in order. Output State, Queued, Rejected, Received (last message or empty). Ignore unknown event types. Socket prop fixed per mount; unsubscribe on unmount.
// Full prompt: ../prompts/3024.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({socket}) {
  // TODO: independently implement the prompt.
  return null;
}
