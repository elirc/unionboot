// 1671 Delayed draft commit / scenario 3 — 300ms quiet period; trim commit; blur does not flush
// Text input initially empty. Editing schedules injected scheduler.after(delay,callback), returning cancel, for 300ms quiet period. Replace/cancel prior task on each edit. Commit trimmed latest value to Saved output and onSave(value). Dirty output pending/clean. Save now flushes once, disabled when clean. Blur leaves pending timer unchanged. Cancel discards pending work, restores latest committed field value. Unmount cancels pending task; retained old callbacks cannot commit. Initial empty draft must not schedule/save.
// Full prompt: ../prompts/1671.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({scheduler,onSave}) {
  // TODO: independently implement the prompt.
  return null;
}
