// 579 Select all checklist / scenario 1
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Render 2 item checkboxes labelled Item1..N, plus All. All selects/deselects every item. All checkbox indeterminate when partially selected, checked only when all selected.
// Run: node mixed-react/verify.cjs --id=579 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 579</p>;}
