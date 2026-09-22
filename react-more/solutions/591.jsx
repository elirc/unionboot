// 591 Bounded quantity editor / scenario 13 — wrap to opposite bound; 2..9; step 20; initial 5
// Start at 5; bounds 2 through 9, step 20. Add/Remove wrap to the opposite bound if an operation overshoots (do not carry the remainder); neither button is disabled. Reset restores the initial value. Show one output.
// Prompt: ../prompts/591.txt
// Run from unionboot: node react-more/verify.cjs --id=591 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [n,set]=useState(5);const move=delta=>set(x=>{const next=x+delta;return next>9?2:next<2?9:next;});return <section><output>{n}</output><button disabled={false} onClick={()=>move(20)}>Add</button><button disabled={false} onClick={()=>move(-20)}>Remove</button><button onClick={()=>set(5)}>Reset</button></section>;
}
