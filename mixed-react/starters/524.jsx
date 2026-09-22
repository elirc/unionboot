// 524 Validated text submission / scenario 1
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Controlled Name field. Submit disabled until trimmed name has at least 2 characters. Submit stores trimmed name in output and clears the field; empty output initially.
// Run: node mixed-react/verify.cjs --id=524 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 524</p>;}
