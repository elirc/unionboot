// 762 Dependent option selection / scenario 14 — initial North; preserve still-valid city; last-option reset; empty region
// Region select North/South/Empty; choices North: Shared,A,B; South: Shared,C; Empty: none. Initially North, city B. Reset chooses last city, or empty if none. On Region change preserve selected nonempty city if valid in new region; otherwise reset. City select disabled for Empty. Output Region:City (use '-' for no selection). Reset button restores original region/city.
// Prompt: ../prompts/762.txt
// Run from unionboot: node react-more/verify.cjs --id=762 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const cities={"North":["Shared","A","B"],"South":["Shared","C"],"Empty":[]};const [region,setRegion]=useState('North'),[city,setCity]=useState("B");const resetValue=r=>cities[r].at(-1)||'';return <section><label>Region<select value={region} onChange={e=>{const next=e.target.value;setRegion(next);setCity(old=>old&&cities[next].includes(old)?old:resetValue(next));}}>{Object.keys(cities).map(x=><option key={x}>{x}</option>)}</select></label><label>City<select disabled={!cities[region].length} value={city} onChange={e=>setCity(e.target.value)}>{cities[region].map(x=><option key={x}>{x}</option>)}</select></label><button onClick={()=>{setRegion('North');setCity("B");}}>Reset</button><output>{region}:{city||'-'}</output></section>;
}
