// 1389 Stopwatch with start and stop [effects]
// Use a real interval: running output says running/stopped. Start begins a seconds counter from 0 in an output labelled Seconds, ticking every second. Stop freezes it; Start again resumes from the current value (no reset). Reset returns to 0 while stopped. Start must be disabled while running. Use setInterval inside useEffect with a cleanup that clears it. Test uses fake timers.
// Run: node react-junior/verify.cjs --id=1389 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1389</p>;}
