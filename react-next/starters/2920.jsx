// 2920 Compound field registration / scenario 2 — Boundary 2; fieldset keeps inputs enabled
// Build compound FieldRoot, FieldInput and FieldSummary components sharing context rather than prop drilling. Root registers descendant field IDs on mount and unregisters on unmount; duplicate IDs are outside contract. Render 2 inputs initially, each labelled Field 1..2, and Registered output with count. Add field mounts one more; Remove field unmounts last but never below zero. Toggle disabled toggles context disabled state; inputs deliberately ignore disabled context, but Disabled output still reflects state. Counts must reflect actual mounted inputs, not a second hardcoded counter.
// Full prompt: ../prompts/2920.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
