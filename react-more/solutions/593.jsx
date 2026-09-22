// 593 Bounded quantity editor / scenario 15 — clamp overshoot; -5..0; step 3; initial -2
// Start at -2; bounds -5 through 0, step 3. Add/Remove clamp overshoots and disable the button at its corresponding bound. Reset restores the initial value. Show one output.
// Prompt: ../prompts/593.txt
// Run from unionboot: node react-more/verify.cjs --id=593 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(-2);const move=delta=>set(x=>{const next=x+delta;return Math.max(-5,Math.min(0,next));});return <section><output>{n}</output><button disabled={n===0} onClick={()=>move(3)}>Add</button><button disabled={n===-5} onClick={()=>move(-3)}>Remove</button><button onClick={()=>set(-2)}>Reset</button></section>;
}
