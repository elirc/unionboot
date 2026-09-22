// 1375 Split a bill without redundant state [state / derived data]
// Controlled number inputs Bill (initial 0), Tip percent (initial 10), and People (initial 1). Output per-person amount to two decimals: bill*(1+tip/100)/people. Valid bill >=0, tip 0..100, people positive integer; all fields required and finite. Invalid or blank fields show em dash (—), never Infinity/NaN. Derive the output rather than synchronize another state variable.
// Run: node react-junior/verify.cjs --id=1375 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const [bill,setBill]=useState('0'),[tip,setTip]=useState('10'),[people,setPeople]=useState('1');
const b=Number(bill),t=Number(tip),p=Number(people);const valid=[bill,tip,people].every(x=>x.trim()!=='')&&[b,t,p].every(Number.isFinite)&&b>=0&&t>=0&&t<=100&&p>0&&Number.isInteger(p);
return <section><label>Bill<input type="number" value={bill} onChange={e=>setBill(e.target.value)}/></label><label>Tip percent<input type="number" value={tip} onChange={e=>setTip(e.target.value)}/></label><label>People<input type="number" value={people} onChange={e=>setPeople(e.target.value)}/></label><output>{valid?(b*(1+t/100)/p).toFixed(2):'—'}</output></section>;}
