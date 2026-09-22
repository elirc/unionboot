// 1376 Bidirectional temperature inputs [state / derived data]
// Celsius and Fahrenheit are controlled text inputs. Initially both empty. The last edited field preserves the exact raw string; derive the other with (C*9/5+32) or ((F-32)*5/9), rounded to one decimal with toFixed(1). Blank, whitespace, or nonfinite/non-numeric input clears the derived field without changing the raw source. Avoid feedback-loop effects and permit negative values.
// Run: node react-junior/verify.cjs --id=1376 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1376</p>;}
