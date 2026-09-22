// 589 Bounded quantity editor / scenario 11 — wrap to opposite bound; 0..5; step 2; initial 0
// Start at 0; bounds 0 through 5, step 2. Add/Remove wrap to the opposite bound if an operation overshoots (do not carry the remainder); neither button is disabled. Reset restores the initial value. Show one output.
// Prompt: ../prompts/589.txt
// Run from unionboot: node react-more/verify.cjs --id=589 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(0);const move=delta=>set(x=>{const next=x+delta;return next>5?0:next<0?5:next;});return <section><output>{n}</output><button disabled={false} onClick={()=>move(2)}>Add</button><button disabled={false} onClick={()=>move(-2)}>Remove</button><button onClick={()=>set(0)}>Reset</button></section>;
}
