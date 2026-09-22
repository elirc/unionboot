// 1412 Independent counters / shared-handler refactor variant [debugging / refactoring]
// Refactoring brief: replace three duplicated counter handlers with a shared update function. The starter is blank; build the refactored version. Requirements: one shared behavior, three labelled buttons Bump A, Bump B, Bump C each incrementing only its own count (output Count A/B/C reads n). Reset all zeroes every count. Keep the component short and DRY — tests care about behavior only: independent increments, exact labels, reset all. The reference solution consolidates the logic; you may use any correct structure.
// Run: node react-junior/verify.cjs --id=1412 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1412</p>;}
