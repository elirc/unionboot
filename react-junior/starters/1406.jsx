// 1406 Keyed list with prepend and remove [state / lists]
// Props initialNames is an ordered array of unique strings. A name input plus Add to top button prepends a trimmed nonempty unique name (case-insensitive uniqueness; reject silently if duplicate/empty). Each row has Remove X. Row numbers 1..N render before each name inside the listitem. New names must appear at index 0 with correct renumbering. Output count. Never reuse key-based DOM identity incorrectly: keys must be the name string.
// Run: node react-junior/verify.cjs --id=1406 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialNames=[]}){return <p>TODO exercise 1406</p>;}
