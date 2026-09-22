// 3133 File batch admission / scenario 15 — Boundary 5; reject whole batch if any file invalid
// Files input type=file multiple. Process files on change, replacing prior selection. Valid files have type text/plain and size<=50 bytes (zero-byte valid). Any invalid member rejects entire batch. Output Names comma-joined, Bytes total accepted size. Alert Rejected N when invalid count>0, otherwise no alert. Empty input selection clears all. Clear resets input.value='' and state so same file can be chosen again. Never mutate FileList or File objects.
// Full prompt: ../prompts/3133.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
