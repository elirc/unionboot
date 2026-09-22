// 1417 Fix the lost selection on rerender [debugging / state]
// Debugging brief (blank starter): an index-based selection breaks when props reorder. Rebuild with stable ids. Requirement: keep the selection stable across item-list changes as long as the id still exists; if the id disappears, clear the selection (output None). Props items are {id,name}; selection via buttons labelled Pick NAME. Output shows the selected name or None.
// Run: node react-junior/verify.cjs --id=1417 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({items=[]}){return <p>TODO exercise 1417</p>;}
