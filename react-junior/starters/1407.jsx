// 1407 Combine category and minimum-rating filters [state]
// Props entries: {id,title,kind,stars}. A Kind select (all/kindA/kindB, initial all) filters by exact kind; a Stars select (all/2/3, initial all) keeps entries with stars >= value. Both filters combine. Output is matched count. List shows title only. Never mutate props; ordering stays as provided.
// Run: node react-junior/verify.cjs --id=1407 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({entries=[]}){return <p>TODO exercise 1407</p>;}
