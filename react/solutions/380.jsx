// 380 Two-stage form wizard / scenario 2
// Step1 Name input requires 2 trimmed characters to enable Next. Step2 review name with Back and Finish. Back retains name. Finish renders output 'Saved: NAME' and removes form controls.
// Run: node react/verify.cjs --id=380 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [step,setStep]=useState(1),[name,set]=useState('');if(step===3)return <output>Saved: {name.trim()}</output>;if(step===2)return <section><p>Review: {name.trim()}</p><button onClick={()=>setStep(1)}>Back</button><button onClick={()=>setStep(3)}>Finish</button></section>;return <section><label>Name<input value={name} onChange={e=>set(e.target.value)}/></label><button disabled={name.trim().length<2} onClick={()=>setStep(2)}>Next</button></section>;}
