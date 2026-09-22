// 1411 Lifted state between two panels [state]
// Two sibling panels share a single source of truth in the parent: Panel A (aria-label Editor) has a Note input; Panel B (aria-label Preview) mirrors it live. A Clear button (outside panels) empties the note. Character count output says N characters. Test verifies editing in A updates B without local copies drifting. Nothing but lifted state may hold the note.
// Run: node react-junior/verify.cjs --id=1411 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1411</p>;}
