// 600 Validated text submission / scenario 12 — 1..4 trimmed characters; any; lower saved text
// Controlled Name input. Submit is disabled unless trimmed length is 1..4 inclusive and matches any nonempty text. Guard form submission as well. Save the lowercase trimmed value in output, then clear input. Invalid submissions leave the previous output intact.
// Prompt: ../prompts/600.txt
// Run from unionboot: node react-more/verify.cjs --id=600 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[saved,save]=useState('');const value=text.trim();const valid=value.length>=1&&value.length<=4&&new RegExp("^[\\s\\S]+$").test(value);return <form onSubmit={e=>{e.preventDefault();if(valid){save(value.toLowerCase());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>Submit</button><output>{saved}</output></form>;
}
