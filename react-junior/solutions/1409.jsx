// 1409 Persist a draft to sessionStorage [effects]
// Text input whose value seeds from sessionStorage key draft-junior (read once on mount; missing means empty string). Each change writes the raw value back to sessionStorage. Clear draft empties input and removes the key. Unmount and re-mount must restore the last draft. Guard every storage access with try/catch so private-mode failures do not crash. Output echoes current input.
// Run: node react-junior/verify.cjs --id=1409 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const KEY='draft-junior';const [text,setText]=useState(()=>{try{return window.sessionStorage.getItem(KEY)||'';}catch(e){return '';}});useEffect(()=>{try{if(text==='')window.sessionStorage.removeItem(KEY);else window.sessionStorage.setItem(KEY,text);}catch(e){}},[text]);
return <section><label>Text<input value={text} onChange={e=>setText(e.target.value)}/></label><button onClick={()=>{setText('');try{window.sessionStorage.removeItem(KEY);}catch(e){}}}>Clear draft</button><output>{text}</output></section>;}
