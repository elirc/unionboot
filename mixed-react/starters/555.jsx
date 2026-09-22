// 555 Paged list controls / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Render props.items with page size 2; page starts1. Prev/Next disabled at boundaries, page output. Empty input shows page1 and no rows.
// Run: node mixed-react/verify.cjs --id=555 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 555</p>;}
