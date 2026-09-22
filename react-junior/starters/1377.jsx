// 1377 Profile form with a saved baseline [forms]
// Props initialName (default Ada) initializes a saved baseline once per mount. Name input edits a draft. Save is disabled if trim is empty or equals saved name; Discard is disabled only when raw draft equals saved name. Save commits trimmed name, normalizes the field, and displays it in output. Discard restores the latest saved baseline, not the initial prop.
// Run: node react-junior/verify.cjs --id=1377 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialName='Ada'}){return <p>TODO exercise 1377</p>;}
