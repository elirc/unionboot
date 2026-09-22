// 3339 Image fallback source ladder / scenario 1 — Boundary 1; source replacement retains fallback index
// Render img alt=Preview using first source. Each DOM error event advances to next source. When exhausted, remove image and show alert No image. Output Index is attempted index, starting 0. On new sources keep index; if it fits render that source, otherwise remain exhausted. DOM load event shows output Loaded yes; changing attempted source clears Loaded to no. Do not fetch images from tests.
// Full prompt: ../prompts/3339.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({sources=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
