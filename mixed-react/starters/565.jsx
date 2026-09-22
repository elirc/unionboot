// 565 Confirm destructive local action / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Display 2 local records count in output. Delete opens labelled dialog 'Confirm removal'. Cancel closes without change; Confirm sets count0 and closes. No external operations. Delete disabled after count0.
// Run: node mixed-react/verify.cjs --id=565 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 565</p>;}
