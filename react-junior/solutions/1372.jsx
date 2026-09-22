// 1372 Move people between teams [state]
// Props people is an ordered array of unique names. Initially all are Available, none Assigned. Use two lists with those accessible names. Each available row has Assign NAME; assigned rows have Return NAME. Moving appends to the destination, removes from source, and cannot create duplicates. Output is assigned count. Preserve the input array.
// Run: node react-junior/verify.cjs --id=1372 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({people=[]}){const [available,setAvailable]=useState(()=>[...people]),[assigned,setAssigned]=useState([]);
const move=(name,assign)=>{if(assign){setAvailable(xs=>xs.filter(x=>x!==name));setAssigned(xs=>xs.includes(name)?xs:[...xs,name]);}else{setAssigned(xs=>xs.filter(x=>x!==name));setAvailable(xs=>xs.includes(name)?xs:[...xs,name]);}};
return <section><ul aria-label="Available">{available.map(x=><li key={x}>{x}<button aria-label={'Assign '+x} onClick={()=>move(x,true)}>Assign</button></li>)}</ul><ul aria-label="Assigned">{assigned.map(x=><li key={x}>{x}<button aria-label={'Return '+x} onClick={()=>move(x,false)}>Return</button></li>)}</ul><output>{assigned.length}</output></section>;}
