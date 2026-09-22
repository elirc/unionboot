// 1397 Typewriter effect with cleanup [effects]
// When playing, reveal one character of the fixed message every 150ms into a Visible output; when finished (or paused), stop advancing. Play/Pause toggles playing; Play resumes mid-word. At completion, keep the Play button disabled. Reset clears the visible text and pauses. Output Label shows playing/paused/done. Must clean up its timer on unmount and on pause. Test uses fake timers.
// Run: node react-junior/verify.cjs --id=1397 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({text="abcdef"}){return <p>TODO exercise 1397</p>;}
