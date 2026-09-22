// 599 Validated text submission / scenario 11 — 3..5 trimmed characters; any; upper saved text
// Controlled Name input. Submit is disabled unless trimmed length is 3..5 inclusive and matches any nonempty text. Guard form submission as well. Save the uppercase trimmed value in output, then clear input. Invalid submissions leave the previous output intact.
// Prompt: ../prompts/599.txt
// Run from unionboot: node react-more/verify.cjs --id=599 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[saved,save]=useState('');const value=text.trim();const valid=value.length>=3&&value.length<=5&&new RegExp("^[\\s\\S]+$").test(value);return <form onSubmit={e=>{e.preventDefault();if(valid){save(value.toUpperCase());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>Submit</button><output>{saved}</output></form>;
}
