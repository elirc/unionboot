// 372 Dependent option selection / scenario 4
// Region select choices North/South, initial South. City choices North: A,B; South: C,D. Region change resets city to first valid option. Output Region:City; City controlled select.
// Run: node react/verify.cjs --id=372 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const cities={North:['A','B'],South:['C','D']};const [region,setRegion]=useState('South'),[city,setCity]=useState('C');return <section><label>Region<select value={region} onChange={e=>{setRegion(e.target.value);setCity(cities[e.target.value][0]);}}>{Object.keys(cities).map(x=><option key={x}>{x}</option>)}</select></label><label>City<select value={city} onChange={e=>setCity(e.target.value)}>{cities[region].map(x=><option key={x}>{x}</option>)}</select></label><output>{region}:{city}</output></section>;}
