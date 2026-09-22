// 2772 Reset-key error boundaries / scenario 14 — Boundary 4; reset when resetKey changes
// A class error boundary catches descendant render errors, shows alert Panel unavailable and Retry panel. Child starts Count=4; Increment adds one. broken prop makes child throw. Recovery remounts child with original Count. A changed resetKey clears the boundary error automatically. An error must not remove a sibling output Shell with text stable. Tests intentionally trigger React error logging.
// Full prompt: ../prompts/2772.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
class Boundary extends React.Component{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidUpdate(prev){if(prev.resetKey!==this.props.resetKey&&this.state.failed)this.setState({failed:false});}render(){return this.state.failed?<section><p role="alert">Panel unavailable</p><button onClick={()=>this.setState({failed:false})}>Retry panel</button></section>:this.props.children;}}
function Fragile({broken}){if(broken)throw Error('Expected exercise fault');const [count,set]=useState(4);return <><output aria-label="Count">{count}</output><button onClick={()=>set(c=>c+1)}>Increment</button></>;}
export default function Exercise({resetKey="A",broken=false}) {
return <section><output aria-label="Shell">stable</output><Boundary resetKey={resetKey}><Fragile broken={broken}/></Boundary></section>;
}
