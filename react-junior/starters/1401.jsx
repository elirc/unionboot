// 1401 Described-by hint and error pairing [a11y]
// Username input with a permanent hint paragraph labelled by an id (text: Lowercase letters and digits only) always rendered and wired via aria-describedby. Validation: only lowercase letters/digits, 3..10 chars. Error paragraph (role alert, same id as hint is NOT allowed — use a second id) with text Use 3-10 lowercase letters or digits appears only when invalid and input has been touched (blur). Set aria-invalid on the input while the error shows.
// Run: node react-junior/verify.cjs --id=1401 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1401</p>;}
