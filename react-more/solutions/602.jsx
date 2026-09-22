// 602 Validated text submission / scenario 14 — 2..6 trimmed characters; digits; keep saved text
// Controlled Name input. Submit is disabled unless trimmed length is 2..6 inclusive and matches ASCII digits only. Guard form submission as well. Save the trimmed value in output, then clear input. Invalid submissions leave the previous output intact.
// Prompt: ../prompts/602.txt
// Run from unionboot: node react-more/verify.cjs --id=602 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [text,set]=useState(''),[saved,save]=useState('');const value=text.trim();const valid=value.length>=2&&value.length<=6&&new RegExp("^[0-9]+$").test(value);return <form onSubmit={e=>{e.preventDefault();if(valid){save(value);set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={!valid}>Submit</button><output>{saved}</output></form>;
}
