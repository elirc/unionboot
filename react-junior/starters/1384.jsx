// 1384 Branching feedback survey [forms / state]
// Step 1 has Enjoyed it checkbox (initial false) and Next. Step 2 shows Improvement textarea if unchecked, Praise textarea if checked, plus Back and Finish. Keep separate drafts for both branches when navigating. Finish requires nonempty trimmed current branch text and outputs Improvement: TEXT or Praise: TEXT, removing all controls. Variant of a wizard: changing the answer changes both the field and validation source.
// Run: node react-junior/verify.cjs --id=1384 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1384</p>;}
