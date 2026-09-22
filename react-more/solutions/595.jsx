// 595 Validated text submission / scenario 7 — 3..6 trimmed characters; letters; lower saved text
// Controlled Name input. Submit is disabled unless trimmed length is 3..6 inclusive and matches ASCII letters only. Guard form submission as well. Save the lowercase trimmed value in output, then clear input. Invalid submissions leave the previous output intact.
// Prompt: ../prompts/595.txt
// Run from unionboot: node react-more/verify.cjs --id=595 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[saved,save]=useState('');const value=text.trim();const valid=value.length>=3&&value.length<=6&&new RegExp("^[A-Za-z]+$").test(value);return <form onSubmit={e=>{e.preventDefault();if(valid){save(value.toLowerCase());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>Submit</button><output>{saved}</output></form>;
}
