// 587 Bounded quantity editor / scenario 9 — clamp overshoot; -8..-2; step 2; initial -5
// Start at -5; bounds -8 through -2, step 2. Add/Remove clamp overshoots and disable the button at its corresponding bound. Reset restores the initial value. Show one output.
// Prompt: ../prompts/587.txt
// Run from unionboot: node react-more/verify.cjs --id=587 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(-5);const move=delta=>set(x=>{const next=x+delta;return Math.max(-8,Math.min(-2,next));});return <section><output>{n}</output><button disabled={n===-2} onClick={()=>move(2)}>Add</button><button disabled={n===-8} onClick={()=>move(-2)}>Remove</button><button onClick={()=>set(-5)}>Reset</button></section>;
}
