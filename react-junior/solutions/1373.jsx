// 1373 Update nested notification preferences [state / debugging]
// Initial preferences: email enabled, SMS disabled, theme light. Expose Email and SMS checkboxes, a Theme select (light/dark), and Reset. Output is JSON with shape {notifications:{email:boolean,sms:boolean},theme:string}. Changing one nested property must preserve its sibling and the theme. Fix the common replacement bug setPrefs({notifications:{email:checked}}).
// Run: node react-junior/verify.cjs --id=1373 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const initial=()=>({notifications:{email:true,sms:false},theme:'light'});
const [prefs,setPrefs]=useState(initial);
return <section>{['email','sms'].map(key=><label key={key}>{key==='email'?'Email':'SMS'}<input type="checkbox" checked={prefs.notifications[key]} onChange={e=>{const checked=e.target.checked;setPrefs(p=>({...p,notifications:{...p.notifications,[key]:checked}}));}}/></label>)}<label>Theme<select value={prefs.theme} onChange={e=>{const theme=e.target.value;setPrefs(p=>({...p,theme}));}}><option>light</option><option>dark</option></select></label><button onClick={()=>setPrefs(initial())}>Reset</button><output>{JSON.stringify(prefs)}</output></section>;}
