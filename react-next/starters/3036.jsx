// 3036 Socket handshake and buffered sends / scenario 18 — Boundary 8; buffer offline sends up to capacity
// Injected socket.subscribe receives {type:'open'|'close'|'message',data?}, returns cleanup. State starts closed. Send button sends incrementing strings starting m9 (sequence baseline 8) when open. While closed queue up to 8 messages FIFO; excess sends are rejected. Rejected attempts do not consume message numbers. On open drain queued messages once in order. Output State, Queued, Rejected, Received (last message or empty). Ignore unknown event types. Socket prop fixed per mount; unsubscribe on unmount.
// Full prompt: ../prompts/3036.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({socket}) {
  // TODO: independently implement the prompt.
  return null;
}
