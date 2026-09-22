// 592 Bounded quantity editor / scenario 14 — wrap to opposite bound; 0..1; step 1; initial 1
// Start at 1; bounds 0 through 1, step 1. Add/Remove wrap to the opposite bound if an operation overshoots (do not carry the remainder); neither button is disabled. Reset restores the initial value. Show one output.
// Prompt: ../prompts/592.txt
// Run from unionboot: node react-more/verify.cjs --id=592 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(1);const move=delta=>set(x=>{const next=x+delta;return next>1?0:next<0?1:next;});return <section><output>{n}</output><button disabled={false} onClick={()=>move(1)}>Add</button><button disabled={false} onClick={()=>move(-1)}>Remove</button><button onClick={()=>set(1)}>Reset</button></section>;
}
