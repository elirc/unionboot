// 359 Fake async request state / scenario 1
// Props load():Promise<string>. Load button starts request, disabled while pending; output idle/loading/response, role alert on rejection. Retry enabled after failure. Ignore result after unmount. Initial idle. Scenario0 uses injected fake service only.
// Run: node react/verify.cjs --id=359 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 359</p>;}
