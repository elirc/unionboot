// 1405 Tree of expandable folders [a11y / state]
// Props tree nodes: {id,name,children?}. Render folders as buttons with aria-expanded inside nested uls; files as plain listitem text. Click toggles that folder only. Initially all collapsed. Expanding a parent reveals its children in the DOM. Data has 2 levels. Use recursion or a flat map; do not mutate props.
// Run: node react-junior/verify.cjs --id=1405 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({tree=[]}){const [open,setOpen]=useState(()=>new Set());const render=node=>{const hasChildren=Array.isArray(node.children);return <li key={node.id}>{hasChildren?<button aria-expanded={open.has(node.id)} onClick={()=>setOpen(old=>{const next=new Set(old);next.has(node.id)?next.delete(node.id):next.add(node.id);return next;})}>{node.name}</button>:node.name}{hasChildren&&open.has(node.id)&&<ul>{node.children.map(render)}</ul>}</li>;};
return <section><ul>{tree.map(render)}</ul></section>;}
