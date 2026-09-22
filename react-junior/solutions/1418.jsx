// 1418 Migration: HOC wrapper to hook [refactoring]
// Refactoring brief (blank starter): replace a wrapper's fetch logic with a reusable hook. Rebuild as a hook: useUser must (1) return {loading,name,error}, (2) call props.fetchUser once on mount only, and (3) clean up properly. Render: while loading show output loading; on success output with the name; on error role alert with message. Reference behavior given in spec; tests use an already-resolved fetchUser.
// Run: node react-junior/verify.cjs --id=1418 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
function useUser(fetchUser){const [state,setState]=React.useState({loading:true,name:'',error:null});React.useEffect(()=>{let live=true;fetchUser().then(user=>{if(live)setState({loading:false,name:user.name,error:null});}).catch(e=>{if(live)setState({loading:false,name:'',error:e.message});});return()=>{live=false;};},[]);return state;}
export default function Exercise({fetchUser}){const {loading,name,error}=useUser(fetchUser);
return <section><output>{loading?'loading':name}</output>{error&&<p role="alert">{error}</p>}</section>;}
