// 1418 Migration: HOC wrapper to hook [refactoring]
// Refactoring brief (blank starter): replace a wrapper's fetch logic with a reusable hook. Rebuild as a hook: useUser must (1) return {loading,name,error}, (2) call props.fetchUser once on mount only, and (3) clean up properly. Render: while loading show output loading; on success output with the name; on error role alert with message. Reference behavior given in spec; tests use an already-resolved fetchUser.
// Run: node react-junior/verify.cjs --id=1418 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({fetchUser}){return <p>TODO exercise 1418</p>;}
