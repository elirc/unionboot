// 3074 Keyboard carousel geometry / scenario 16 — Boundary 6; cyclic slide navigation
// Carousel region labelled Gallery contains exactly one visible slide, a role=group labelled Slide X of 8. Initial index 1. ArrowRight/Left on Gallery and Next/Previous buttons wrap across 8 slides. Home/End select endpoints. Output Position is X/8. Both buttons always enabled. Do not move DOM focus when selecting slides. No timers/auto-play.
// Full prompt: ../prompts/3074.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [index,set]=useState(0);const move=d=>set(i=>(i+d+8)%8);return <section role="region" aria-label="Gallery" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='Home')set(0);if(e.key==='End')set(7);}}><div role="group" aria-label={'Slide '+(index+1)+' of 8'}>Photo {index+1}</div><button disabled={false} onClick={()=>move(-1)}>Previous</button><button disabled={false} onClick={()=>move(1)}>Next</button><output aria-label="Position">{index+1}/8</output></section>;
}
