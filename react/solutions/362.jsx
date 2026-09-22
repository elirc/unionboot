// 362 Fake async request state / scenario 4
// Props load():Promise<string>. Load button starts request, disabled while pending; output idle/loading/response, role alert on rejection. Retry enabled after failure. Ignore result after unmount. Initial idle. Scenario3 uses injected fake service only.
// Run: node react/verify.cjs --id=362 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [state,set]=useState({status:'idle',value:''});const live=useRef(true);useEffect(()=>{live.current=true;return ()=>{live.current=false;};},[]);async function run(){set({status:'loading',value:''});try{const value=await load();if(live.current)set({status:'done',value});}catch(error){if(live.current)set({status:'error',value:error.message});}}return <section><button disabled={state.status==='loading'} onClick={run}>Load</button><output>{state.status==='done'?state.value:state.status}</output>{state.status==='error'&&<p role="alert">{state.value}</p>}</section>;}
