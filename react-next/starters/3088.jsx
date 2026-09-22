// 3088 Lazy panel mount lifetime / scenario 10 — Boundary 10; unmount inactive panels
// Two tabs A/B with labelled tabpanels. Only A is initially mounted; B mounts on first visit. Each panel owns an uncontrolled Note A/B input initialized to seed10. Inactive panels unmount, so revisiting resets uncontrolled draft and reruns mount effect. Child effect calls onMount(name) and cleanup onUnmount(name). Tab aria-selected must track active; use matching tab/tabpanel IDs. This tests mount lifetime, beyond basic tab selection.
// Full prompt: ../prompts/3088.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({onMount,onUnmount}) {
  // TODO: independently implement the prompt.
  return null;
}
