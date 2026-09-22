// 1415 Trace a missing effect dependency [debugging / effects]
// Debugging brief, blank starter: an effect depending only on query forgets mode. Query input starts empty; Mode select alpha/beta starts alpha. Props fetchCombined(query,mode) resolves a string. Output Result initially/loading while pending, then the resolved string. Fetch when either input or service prop changes. Ignore stale completions; report errors with Result=error and role alert.
// Run: node react-junior/verify.cjs --id=1415 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({fetchCombined}){return <p>TODO exercise 1415</p>;}
