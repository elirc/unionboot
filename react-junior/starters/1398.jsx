// 1398 Track window focus changes [effects]
// Output focused/blur must track the real window focus and blur events (jsdom fires them). Register listeners on window in one effect and remove them on unmount; no stale listeners after unmount (unmount then fire blur and confirm nothing crashes). Initial value focused. A Blur now button dispatches a real window blur event for the test.
// Run: node react-junior/verify.cjs --id=1398 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1398</p>;}
