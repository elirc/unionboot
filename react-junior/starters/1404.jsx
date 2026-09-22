// 1404 Skip link and landmark order [a11y]
// Render: a skip link (a element) with text Skip to content pointing to #main, a banner landmark (header with aria-label Site header) containing a nav with two links Home, About, then main landmark with aria-label Main content holding a paragraph. Skip link href must be exactly #main and the main landmark must have id main. Include at least one other element between them to make the skip meaningful. Verify DOM order: skip link first child of the outer section.
// Run: node react-junior/verify.cjs --id=1404 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1404</p>;}
