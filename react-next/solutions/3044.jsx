// 3044 Table schema visibility projection / scenario 6 — Boundary 6; allow empty schema
// Render a table with one header and one data row; input columns define schema order and cell text is column + '-value'. Each Show Cx checkbox toggles visibility, preserving original schema order when restored. Permit all columns hidden; keep an empty table row. Output Schema joins visible column names by comma. New columns introduced via props become visible; removed columns disappear. Hidden names retained internally so a removed then restored previously hidden column remains hidden. No row sorting or data selection.
// Full prompt: ../prompts/3044.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({columns=[]}) {
const [hidden,set]=useState([]);const shown=columns.filter(c=>!hidden.includes(c));return <section>{columns.map(c=><label key={c}>Show {c}<input type="checkbox" checked={!hidden.includes(c)} disabled={false} onChange={()=>set(xs=>xs.includes(c)?xs.filter(x=>x!==c):[...xs,c])}/></label>)}<table><thead><tr>{shown.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody><tr>{shown.map(c=><td key={c}>{c}-value</td>)}</tr></tbody></table><output aria-label="Schema">{shown.join(',')}</output></section>;
}
