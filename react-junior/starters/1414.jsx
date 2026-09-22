// 1414 Context refactor of nested theme controls [debugging / refactoring]
// Refactoring brief, blank starter: replace theme and toggle props passed through middle layers with module-scope context. Exercise owns light/dark state, a nested leaf group Themed box displays theme in output, and a second leaf Toggle button changes it using context. The middle layer should receive neither theme nor toggle. Initial light. Each mounted Exercise is independent.
// Run: node react-junior/verify.cjs --id=1414 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1414</p>;}
