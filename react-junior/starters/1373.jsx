// 1373 Update nested notification preferences [state / debugging]
// Initial preferences: email enabled, SMS disabled, theme light. Expose Email and SMS checkboxes, a Theme select (light/dark), and Reset. Output is JSON with shape {notifications:{email:boolean,sms:boolean},theme:string}. Changing one nested property must preserve its sibling and the theme. Fix the common replacement bug setPrefs({notifications:{email:checked}}).
// Run: node react-junior/verify.cjs --id=1373 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){return <p>TODO exercise 1373</p>;}
