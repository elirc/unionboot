// 1403 Accessible star rating [a11y]
// 5 buttons labelled Rate X out of 5 (X=1..5). aria-pressed reflects rating; unrated initially (output 0). Each button text is the star character repeated X times plus ' Rate X out of 5' aria-label semantics via accessible name. Click sets the rating; output shows the number. Clear button resets to 0. Radiogroup alternative is not required; buttons suffice. Buttons must be individually addressable by role button and name Rate X out of 5.
// Run: node react-junior/verify.cjs --id=1403 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1403</p>;}
