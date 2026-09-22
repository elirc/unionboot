// 362 Fake async request state / scenario 4
// Props load():Promise<string>. Load button starts request, disabled while pending; output idle/loading/response, role alert on rejection. Retry enabled after failure. Ignore result after unmount. Initial idle. Scenario3 uses injected fake service only.
// Run: node react/verify.cjs --id=362 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
export default function Exercise(props){return <p>TODO exercise 362</p>;}
