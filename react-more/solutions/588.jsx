// 588 Bounded quantity editor / scenario 10 — clamp overshoot; 4..4; step 1; initial 4
// Start at 4; bounds 4 through 4, step 1. Add/Remove clamp overshoots and disable the button at its corresponding bound. Reset restores the initial value. Show one output.
// Prompt: ../prompts/588.txt
// Run from unionboot: node react-more/verify.cjs --id=588 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(4);const move=delta=>set(x=>{const next=x+delta;return Math.max(4,Math.min(4,next));});return <section><output>{n}</output><button disabled={n===4} onClick={()=>move(1)}>Add</button><button disabled={n===4} onClick={()=>move(-1)}>Remove</button><button onClick={()=>set(4)}>Reset</button></section>;
}
