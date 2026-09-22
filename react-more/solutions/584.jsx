// 584 Bounded quantity editor / scenario 6 — clamp overshoot; -3..5; step 2; initial -1
// Start at -1; bounds -3 through 5, step 2. Add/Remove clamp overshoots and disable the button at its corresponding bound. Reset restores the initial value. Show one output.
// Prompt: ../prompts/584.txt
// Run from unionboot: node react-more/verify.cjs --id=584 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(-1);const move=delta=>set(x=>{const next=x+delta;return Math.max(-3,Math.min(5,next));});return <section><output>{n}</output><button disabled={n===5} onClick={()=>move(2)}>Add</button><button disabled={n===-3} onClick={()=>move(-2)}>Remove</button><button onClick={()=>set(-1)}>Reset</button></section>;
}
