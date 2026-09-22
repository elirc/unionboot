// 1370 Immutable cart line updates [state]
// Props initialItems is an array of {id,name,price,quantity} with integer prices in cents. Keep a local editable cart. Render each item in a listitem with buttons Increase NAME and Decrease NAME. Quantities cannot go below 0; disable Decrease at 0. Each row has an output labelled Quantity NAME. A separate output labelled Total displays cents. Updating one row must preserve others and never mutate initialItems.
// Run: node react-junior/verify.cjs --id=1370 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialItems=[]}){return <p>TODO exercise 1370</p>;}
