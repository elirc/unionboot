// 3258 Keyboard multi-selection listbox / scenario 20 — Boundary 12; selection insertion order
// Listbox Choices with 12 options Item1..Item12; aria-multiselectable=true. Keep focus on listbox; aria-activedescendant points to active option. Initially Item1 active. Up/Down clamp active index. Space toggles active selection. Click toggles clicked option and makes it active. Selected output joins chosen names in selection order, or none. Ctrl+A selects all, Clear empties selection. No range selection.
// Full prompt: ../prompts/3258.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
