// 536 Exclusive accordion / scenario 3
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Three sections One,Two,Three, initially section 3 open. Buttons expose aria-expanded, opening another closes previous; clicking current closes it. Content is unmounted while closed.
// Run: node mixed-react/verify.cjs --id=536 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 536</p>;}
