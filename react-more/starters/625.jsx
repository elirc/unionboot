// 625 Accessible tab selection / scenario 7 — vertical; automatic activation; disabled Green; initial 2
// Red/Green/Blue tabs in a tablist with aria-orientation=vertical. Green is disabled. Initially select and make focusable index 2. ArrowDown/ArrowUp move focus, skip disabled tabs, wrap. Home/End focus first/last enabled tab. Navigation also selects the focused tab. Click selects and focuses. Ignore the other axis. Use roving tabIndex, aria-selected and one tabpanel showing the selected name.
// Prompt: ../prompts/625.txt
// Run from unionboot: node react-more/verify.cjs --id=625 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
