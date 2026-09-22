// 585 Bounded quantity editor / scenario 7 — clamp overshoot; 2..11; step 4; initial 2
// Start at 2; bounds 2 through 11, step 4. Add/Remove clamp overshoots and disable the button at its corresponding bound. Reset restores the initial value. Show one output.
// Prompt: ../prompts/585.txt
// Run from unionboot: node react-more/verify.cjs --id=585 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(2);const move=delta=>set(x=>{const next=x+delta;return Math.max(2,Math.min(11,next));});return <section><output>{n}</output><button disabled={n===11} onClick={()=>move(4)}>Add</button><button disabled={n===2} onClick={()=>move(-4)}>Remove</button><button onClick={()=>set(2)}>Reset</button></section>;
}
