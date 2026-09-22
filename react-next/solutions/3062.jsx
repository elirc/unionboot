// 3062 Keyboard carousel geometry / scenario 4 — Boundary 4; bounded slide navigation
// Carousel region labelled Gallery contains exactly one visible slide, a role=group labelled Slide X of 6. Initial index 1. ArrowRight/Left on Gallery and Next/Previous buttons clamp across 6 slides. Home/End select endpoints. Output Position is X/6. Disable navigation buttons at boundaries. Do not move DOM focus when selecting slides. No timers/auto-play.
// Full prompt: ../prompts/3062.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [index,set]=useState(0);const move=d=>set(i=>Math.max(0,Math.min(5,i+d)));return <section role="region" aria-label="Gallery" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='Home')set(0);if(e.key==='End')set(5);}}><div role="group" aria-label={'Slide '+(index+1)+' of 6'}>Photo {index+1}</div><button disabled={index===0} onClick={()=>move(-1)}>Previous</button><button disabled={index===5} onClick={()=>move(1)}>Next</button><output aria-label="Position">{index+1}/6</output></section>;
}
