// 3078 Keyboard carousel geometry / scenario 20 — Boundary 10; cyclic slide navigation
// Carousel region labelled Gallery contains exactly one visible slide, a role=group labelled Slide X of 12. Initial index 1. ArrowRight/Left on Gallery and Next/Previous buttons wrap across 12 slides. Home/End select endpoints. Output Position is X/12. Both buttons always enabled. Do not move DOM focus when selecting slides. No timers/auto-play.
// Full prompt: ../prompts/3078.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [index,set]=useState(0);const move=d=>set(i=>(i+d+12)%12);return <section role="region" aria-label="Gallery" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='Home')set(0);if(e.key==='End')set(11);}}><div role="group" aria-label={'Slide '+(index+1)+' of 12'}>Photo {index+1}</div><button disabled={false} onClick={()=>move(-1)}>Previous</button><button disabled={false} onClick={()=>move(1)}>Next</button><output aria-label="Position">{index+1}/12</output></section>;
}
