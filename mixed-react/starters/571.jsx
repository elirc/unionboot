// 571 Reducer undoable text / scenario 3
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Text starts 'v2'. A controlled Text input commits each change as a history entry. Undo/Redo navigate entries; editing after Undo discards redo. Disable unavailable buttons. Implement useReducer.
// Run: node mixed-react/verify.cjs --id=571 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 571</p>;}
