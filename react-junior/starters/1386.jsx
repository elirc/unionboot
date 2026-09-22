// 1386 Optimistic comment list with rollback [CRUD / async]
// Props initialComments is {id,text}[], submitComment(text) resolves true/false or rejects. Comment input and Post button add a trimmed comment at the top immediately, clear the field, and disable Post while pending. Output is count. Rejected/false submissions remove only the optimistic row, restore its text to the input, show alert Post rejected, and enable retry. Success keeps the row; retry clears the alert. Existing comments must remain unchanged.
// Run: node react-junior/verify.cjs --id=1386 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialComments=[],submitComment}){return <p>TODO exercise 1386</p>;}
