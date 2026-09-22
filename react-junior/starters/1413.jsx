// 1413 Refactor me: chained conditionals to map [debugging / refactoring]
// Refactoring brief (blank starter): replace a long if/else chain mapping status codes to labels (paid -> Payment received, pending -> Awaiting payment, failed -> Payment failed, unknown -> Status unknown). Replace with a data-driven lookup; behavior: uppercase-insensitive input prop status (default 'pending'), output label, and an output detail line CODE:LABEL (no space after colon). Unknown codes (including empty) map to the unknown label.
// Run: node react-junior/verify.cjs --id=1413 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({status="pending"}){return <p>TODO exercise 1413</p>;}
