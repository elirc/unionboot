// 1399 Focus trap within a dialog [a11y]
// Open via Open button. Dialog (role dialog, aria-label Wizard) contains two buttons First and Last. Tab from Last wraps to First; Shift+Tab from First wraps to Last. Focus the First button automatically when the dialog opens. Close button unmounts it. Implement with keydown handling on the dialog container. Output states open/closed.
// Run: node react-junior/verify.cjs --id=1399 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1399</p>;}
