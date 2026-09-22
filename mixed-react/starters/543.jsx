// 543 Accessible tab selection / scenario 5
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Three tabs Red,Green,Blue, initial 1. Click or ArrowRight/ArrowLeft selects and focuses a tab, wrapping at ends. Expose tablist, tab, aria-selected and one tabpanel. Roving tabIndex.
// Run: node mixed-react/verify.cjs --id=543 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 543</p>;}
