// 1374 Three-state stable sorting [state]
// Variant of a sortable list: Score cycles original -> ascending -> descending -> original. Props rows are {id,name,score}. Render names in listitems. Ties retain original order even descending; do not mutate props. One output says original/ascending/descending. New rows from a rerender must be reflected without resetting the active sort mode.
// Run: node react-junior/verify.cjs --id=1374 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({rows=[]}){return <p>TODO exercise 1374</p>;}
