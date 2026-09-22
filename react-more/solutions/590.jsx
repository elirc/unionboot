// 590 Bounded quantity editor / scenario 12 — wrap to opposite bound; -3..3; step 4; initial 3
// Start at 3; bounds -3 through 3, step 4. Add/Remove wrap to the opposite bound if an operation overshoots (do not carry the remainder); neither button is disabled. Reset restores the initial value. Show one output.
// Prompt: ../prompts/590.txt
// Run from unionboot: node react-more/verify.cjs --id=590 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(3);const move=delta=>set(x=>{const next=x+delta;return next>3?-3:next<-3?3:next;});return <section><output>{n}</output><button disabled={false} onClick={()=>move(4)}>Add</button><button disabled={false} onClick={()=>move(-4)}>Remove</button><button onClick={()=>set(3)}>Reset</button></section>;
}
