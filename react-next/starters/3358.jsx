// 3358 Image fallback source ladder / scenario 20 — Boundary 10; source replacement resets fallback index
// Render img alt=Preview using first source. Each DOM error event advances to next source. When exhausted, remove image and show alert No image. Output Index is attempted index, starting 0. When sources prop identity changes, reset index to 0. DOM load event shows output Loaded yes; changing attempted source clears Loaded to no. Do not fetch images from tests.
// Full prompt: ../prompts/3358.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({sources=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
