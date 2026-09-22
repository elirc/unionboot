// 1393 Restart an in-flight job [async]
// Props runTask(job) returns Promise<string>; job defaults to 1. Start is always enabled and launches a new request, superseding any previous request. Output idle/loading/DONE:RESULT/error; rejection of the current request also shows an alert message. Older success or failure must never change output. Ignore completion after unmount.
// Run: node react-junior/verify.cjs --id=1393 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({job=1,runTask}){return <p>TODO exercise 1393</p>;}
