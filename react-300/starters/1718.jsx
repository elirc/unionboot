// 1718 Editable combobox navigation / scenario 10 — Substring search; wrap options; limit 2
// Color input role combobox, aria-autocomplete=list, controls a unique listbox ID. Initially closed. Typing opens filtered options (substring, trim/case-fold query), limited to 2, resets active option to first (none if empty). ArrowDown/Up wrap active option; input keeps DOM focus, aria-activedescendant points at active option. Enter selects active; clicking option also selects; Selection output chosen text, input replaced by choice, popup closes. Escape closes without selecting or clearing draft. Empty matches all; no results renders No matches text.
// Full prompt: ../prompts/1718.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
