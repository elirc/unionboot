// 349 Context preference provider / scenario 1
// Create Context inside module. Provider starts theme 'light'. Nested child displays theme in output; Toggle switches theme. Avoid prop drilling for theme and toggle callback.
// Run: node react/verify.cjs --id=349 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';
const ThemeContext=React.createContext(null);function ThemeChild(){const {theme,toggle}=React.useContext(ThemeContext);return <section><output>{theme}</output><button onClick={toggle}>Toggle</button></section>;}
export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [theme,set]=useState('light');return <ThemeContext.Provider value={{theme,toggle:()=>set(x=>x==='light'?'dark':'light')}}><ThemeChild/></ThemeContext.Provider>;}
