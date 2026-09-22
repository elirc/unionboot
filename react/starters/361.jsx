// 361 Fake async request state / scenario 3
// Props load():Promise<string>. Load button starts request, disabled while pending; output idle/loading/response, role alert on rejection. Retry enabled after failure. Ignore result after unmount. Initial idle. Scenario2 uses injected fake service only.
// Run: node react/verify.cjs --id=361 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 361</p>;}
