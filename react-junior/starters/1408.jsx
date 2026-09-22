// 1408 Copy to clipboard button [effects]
// Props text (default props-text). Button Copy labelled Copy uses a navigator.clipboard stub (defined in the test via Object.assign(navigator,{clipboard:{writeText:clock.fn(()=>Promise.resolve())}})). Initial output idle; after success output copied; on failure output failed. Failure path (stub rejects) shows role alert Copy failed. Button must call writeText exactly once with props.text. Restore clipboard after test.
// Run: node react-junior/verify.cjs --id=1408 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({text="props-text"}){return <p>TODO exercise 1408</p>;}
