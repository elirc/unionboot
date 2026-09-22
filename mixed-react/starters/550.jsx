// 550 Stable sortable table / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Props rows {id,name,score}; default order by score ascending. Name/Score header buttons choose ascending column; clicking current reverses. Preserve original tie order. Display data in accessible table.
// Run: node mixed-react/verify.cjs --id=550 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 550</p>;}
