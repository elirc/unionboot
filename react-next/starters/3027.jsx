// 3027 Socket handshake and buffered sends / scenario 9 — Boundary 9; reject offline sends
// Injected socket.subscribe receives {type:'open'|'close'|'message',data?}, returns cleanup. State starts closed. Send button sends incrementing strings starting m10 (sequence baseline 9) when open. While closed reject all sends. Rejected attempts do not consume message numbers. On open drain queued messages once in order. Output State, Queued, Rejected, Received (last message or empty). Ignore unknown event types. Socket prop fixed per mount; unsubscribe on unmount.
// Full prompt: ../prompts/3027.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({socket}) {
  // TODO: independently implement the prompt.
  return null;
}
