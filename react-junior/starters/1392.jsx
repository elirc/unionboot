// 1392 Ignore stale profile responses [async]
// Props fetchUser(id) returns Promise<{id,name}>. userId defaults to 1. On mount and each changed userId, output User shows loading, then the latest user's name; errors show output error and role alert message. Ignore stale success and failure after a newer request or unmount. Use an effect cleanup flag; do not make network calls outside the injected service.
// Run: node react-junior/verify.cjs --id=1392 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({userId=1,fetchUser}){return <p>TODO exercise 1392</p>;}
