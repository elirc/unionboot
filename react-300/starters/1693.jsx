// 1693 Storage-backed versioned draft / scenario 5 — Schema version 5; raw storage
// Injected storage getItem/setItem/removeItem may throw. Read storageKey once on mount. Accept JSON {version:5,text:string}, else use empty draft (wrong version, malformed, absent). Text editing stores JSON same schema with raw text while field preserves raw input; output Text echoes field. Clear empties field and removes key, not storing empty JSON. No mount write. Output Storage says ok or unavailable after operation failure; input still usable. Do not access browser storage directly. storageKey is fixed per mount.
// Full prompt: ../prompts/1693.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({storage,storageKey="draft"}) {
  // TODO: independently implement the prompt.
  return null;
}
