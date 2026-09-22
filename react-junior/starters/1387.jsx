// 1387 Paginated people table [CRUD]
// Props people is {id,name,role}. 3 per page, page 1-based starting at 1, page number in a Page output. Prev/Next disabled at boundaries; a Jump to last button shows the final page. When people changes via rerender, clamp the page into the valid range instead of showing an empty page. Table with column headers Name, Role and accessible table semantics. No state duplication of props.
// Run: node react-junior/verify.cjs --id=1387 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({people=[]}){return <p>TODO exercise 1387</p>;}
