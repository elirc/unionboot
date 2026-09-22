// 1405 Tree of expandable folders [a11y / state]
// Props tree nodes: {id,name,children?}. Render folders as buttons with aria-expanded inside nested uls; files as plain listitem text. Click toggles that folder only. Initially all collapsed. Expanding a parent reveals its children in the DOM. Data has 2 levels. Use recursion or a flat map; do not mutate props.
// Run: node react-junior/verify.cjs --id=1405 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({tree=[]}){return <p>TODO exercise 1405</p>;}
