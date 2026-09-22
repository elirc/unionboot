// 1369 Repair a batched counter [state / debugging]
// Start at 0 in one output. Add three must add exactly 3 in one click; Reset returns to 0. Repair the stale-snapshot bug illustrated by three consecutive setCount(count + 1) calls. Use functional state updates for the three increments; no module-level state. Repeated clicks must accumulate.
// Run: node react-junior/verify.cjs --id=1369 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1369</p>;}
