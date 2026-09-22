// 1402 Roving tabindex list navigation [a11y]
// A vertical list of 4 fruits (aria-label Fruits) rendered as buttons in listitems. Exactly one is focusable via roving tabindex matching selection. ArrowDown/ArrowUp move selection and focus (no wrap needed beyond ends: clamp). Home/End select first/last. Click selects and focuses. Output shows the selected fruit. Variant of tab-pattern: same roving concept, list semantics.
// Run: node react-junior/verify.cjs --id=1402 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1402</p>;}
