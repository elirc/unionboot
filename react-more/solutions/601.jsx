// 601 Validated text submission / scenario 13 — 5..9 trimmed characters; letters; upper saved text
// Controlled Name input. Submit is disabled unless trimmed length is 5..9 inclusive and matches ASCII letters only. Guard form submission as well. Save the uppercase trimmed value in output, then clear input. Invalid submissions leave the previous output intact.
// Prompt: ../prompts/601.txt
// Run from unionboot: node react-more/verify.cjs --id=601 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[saved,save]=useState('');const value=text.trim();const valid=value.length>=5&&value.length<=9&&new RegExp("^[A-Za-z]+$").test(value);return <form onSubmit={e=>{e.preventDefault();if(valid){save(value.toUpperCase());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>Submit</button><output>{saved}</output></form>;
}
