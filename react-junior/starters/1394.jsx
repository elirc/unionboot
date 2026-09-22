// 1394 Batch fetch with partial failure [async]
// Props fetchOne(id) returns Promise<string>; ids defaults to [1,2,3]. Load concurrently fetches each id. Output initially idle, loading while pending, then results joined with | in input-id order; failed slots are (failed). Alert lists only failed ids joined with commas in input order. Disable Load while pending. A new load clears the previous alert. Empty ids results in an empty output. Use Promise.allSettled.
// Run: node react-junior/verify.cjs --id=1394 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({ids=[1,2,3],fetchOne}){return <p>TODO exercise 1394</p>;}
