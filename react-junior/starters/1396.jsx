// 1396 Debounced save with flushed unsaved state [effects]
// Text input auto-saves 400ms after the last keystroke. Unsaved output says Unsaved changes or Saved; a Save now button flushes immediately (disabled when nothing pending). Navigating away (unmount) must not throw. After save, output returns to Saved. Use effect + timeout with the right dependency list so repeated typing does not save each keystroke.
// Run: node react-junior/verify.cjs --id=1396 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1396</p>;}
