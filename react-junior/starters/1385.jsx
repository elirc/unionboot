// 1385 Editable inventory rows [CRUD]
// Props seedRows is an array of {id,name,quantity}. Editable rows: each row has Name and Qty (number) inputs labelled NAME name / NAME qty, plus Remove NAME. Add row appends {name:'',quantity:0} with a fresh unique id. Total output is total quantity. Removing keeps others intact. Snapshot button records a deep copy of current rows into an output labelled Snapshot as JSON; later edits must not alter it.
// Run: node react-junior/verify.cjs --id=1385 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({seedRows=[]}){return <p>TODO exercise 1385</p>;}
