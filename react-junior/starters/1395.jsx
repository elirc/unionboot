// 1395 Poll for status until ready [async / effects]
// Props check() resolves pending/ready. Start begins polling every 200ms; initial output idle, active output Polling…, ready output Ready. Start disabled once started. Avoid overlapping checks if a response takes over 200ms. On rejection stop polling and show output error plus alert message. Cleanup the interval on unmount and ignore outstanding results.
// Run: node react-junior/verify.cjs --id=1395 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({check}){return <p>TODO exercise 1395</p>;}
