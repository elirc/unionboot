// 596 Validated text submission / scenario 8 — 1..3 trimmed characters; digits; keep saved text
// Controlled Name input. Submit is disabled unless trimmed length is 1..3 inclusive and matches ASCII digits only. Guard form submission as well. Save the trimmed value in output, then clear input. Invalid submissions leave the previous output intact.
// Prompt: ../prompts/596.txt
// Run from unionboot: node react-more/verify.cjs --id=596 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[saved,save]=useState('');const value=text.trim();const valid=value.length>=1&&value.length<=3&&new RegExp("^[0-9]+$").test(value);return <form onSubmit={e=>{e.preventDefault();if(valid){save(value);set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>Submit</button><output>{saved}</output></form>;
}
