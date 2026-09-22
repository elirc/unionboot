// 1410 Memoized filtering / performance variant [performance]
// Props items are {id,name,tier}. A Tier select (all/gold/silver) and a Min length number input (nonnegative integer, default 0). Render matching names (exact tier match AND name length >= min) in listitems. Compute the filtered list with useMemo keyed on [items, tier, minLength]; otherwise still correct. Output count. Changing an unrelated rerender prop must not reset either control (state lives in the component, not the list).
// Run: node react-junior/verify.cjs --id=1410 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({items=[]}){return <p>TODO exercise 1410</p>;}
