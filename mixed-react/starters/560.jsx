// 560 Editable label with cancel / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Initially show label 'Draft 1'. Edit opens Name input initialized from saved value. Save trims and commits only nonempty input; Cancel discards draft. Enter submits; Escape cancels.
// Run: node mixed-react/verify.cjs --id=560 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 560</p>;}
