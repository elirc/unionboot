// 1370 Immutable cart line updates [state]
// Props initialItems is an array of {id,name,price,quantity} with integer prices in cents. Keep a local editable cart. Render each item in a listitem with buttons Increase NAME and Decrease NAME. Quantities cannot go below 0; disable Decrease at 0. Each row has an output labelled Quantity NAME. A separate output labelled Total displays cents. Updating one row must preserve others and never mutate initialItems.
// Run: node react-junior/verify.cjs --id=1370 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({initialItems=[]}){const [items,setItems]=useState(()=>initialItems.map(x=>({...x})));
const adjust=(id,step)=>setItems(old=>old.map(x=>x.id===id?{...x,quantity:Math.max(0,x.quantity+step)}:x));
return <section><ul>{items.map(x=><li key={x.id}>{x.name}<output aria-label={'Quantity '+x.name}>{x.quantity}</output><button aria-label={'Increase '+x.name} onClick={()=>adjust(x.id,1)}>+</button><button aria-label={'Decrease '+x.name} disabled={x.quantity===0} onClick={()=>adjust(x.id,-1)}>-</button></li>)}</ul><output aria-label="Total">{items.reduce((sum,x)=>sum+x.price*x.quantity,0)}</output></section>;}
