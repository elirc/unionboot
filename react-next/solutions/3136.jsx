// 3136 File batch admission / scenario 18 — Boundary 8; reject whole batch if any file invalid
// Files input type=file multiple. Process files on change, replacing prior selection. Valid files have type text/plain and size<=80 bytes (zero-byte valid). Any invalid member rejects entire batch. Output Names comma-joined, Bytes total accepted size. Alert Rejected N when invalid count>0, otherwise no alert. Empty input selection clears all. Clear resets input.value='' and state so same file can be chosen again. Never mutate FileList or File objects.
// Full prompt: ../prompts/3136.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [files,set]=useState([]),[invalid,reject]=useState(0),input=useRef(null);return <section><label>Files<input ref={input} type="file" multiple onChange={e=>{const all=Array.from(e.target.files||[]),good=all.filter(f=>f.type==='text/plain'&&f.size<=80),bad=all.length-good.length;reject(bad);set(bad?[]:good);}}/></label><output aria-label="Names">{files.map(f=>f.name).join(',')}</output><output aria-label="Bytes">{files.reduce((s,f)=>s+f.size,0)}</output>{invalid>0&&<p role="alert">Rejected {invalid}</p>}<button onClick={()=>{input.current.value='';set([]);reject(0);}}>Clear</button></section>;
}
