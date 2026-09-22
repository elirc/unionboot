// 586 Bounded quantity editor / scenario 8 — clamp overshoot; 0..3; step 8; initial 3
// Start at 3; bounds 0 through 3, step 8. Add/Remove clamp overshoots and disable the button at its corresponding bound. Reset restores the initial value. Show one output.
// Prompt: ../prompts/586.txt
// Run from unionboot: node react-more/verify.cjs --id=586 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(3);const move=delta=>set(x=>{const next=x+delta;return Math.max(0,Math.min(3,next));});return <section><output>{n}</output><button disabled={n===3} onClick={()=>move(8)}>Add</button><button disabled={n===0} onClick={()=>move(-8)}>Remove</button><button onClick={()=>set(3)}>Reset</button></section>;
}
