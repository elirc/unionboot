// 1692 Storage-backed versioned draft / scenario 4 — Schema version 4; raw storage
// Injected storage getItem/setItem/removeItem may throw. Read storageKey once on mount. Accept JSON {version:4,text:string}, else use empty draft (wrong version, malformed, absent). Text editing stores JSON same schema with raw text while field preserves raw input; output Text echoes field. Clear empties field and removes key, not storing empty JSON. No mount write. Output Storage says ok or unavailable after operation failure; input still usable. Do not access browser storage directly. storageKey is fixed per mount.
// Full prompt: ../prompts/1692.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({storage,storageKey="draft"}) {
  // TODO: independently implement the prompt.
  return null;
}
