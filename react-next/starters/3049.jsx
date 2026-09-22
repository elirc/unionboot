// 3049 Table schema visibility projection / scenario 11 — Boundary 1; protect final visible column
// Render a table with one header and one data row; input columns define schema order and cell text is column + '-value'. Each Show Cx checkbox toggles visibility, preserving original schema order when restored. Disable unchecking the final visible column. Output Schema joins visible column names by comma. New columns introduced via props become visible; removed columns disappear. Hidden names retained internally so a removed then restored previously hidden column remains hidden. No row sorting or data selection.
// Full prompt: ../prompts/3049.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({columns=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
