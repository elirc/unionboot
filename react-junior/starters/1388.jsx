// 1388 Expandable search over records [CRUD / a11y]
// Props records are {id,title,summary}. A Search input filters case-insensitively on title substring only (not summary). Render matches as buttons with aria-expanded, unexpanded rows show title only. Expanding shows the summary paragraph. Multiple rows can be expanded at once. Zero matches render an output with 0. Empty query matches all. Expansion is retained even while a row is filtered out. Row expansion must survive unrelated typing that keeps the row visible.
// Run: node react-junior/verify.cjs --id=1388 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({records=[]}){return <p>TODO exercise 1388</p>;}
