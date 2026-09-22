'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
// Twenty interaction families with explicit rule variants. Each file implements
// its own component; the starter never imports the reference implementation.
const families=[];
function family(name,create){families.push({name,create});}
family('Bounded quantity editor',v=>({
 spec:`Start at ${v}, step ${v+1}, minimum0, maximum${v+5}. Buttons Add, Remove, Reset; clamp at bounds, disable Remove at0 and Add at maximum. Show quantity in output.`,
 code:`const [n,set]=useState(${v});return <section><output>{n}</output><button disabled={n===${v+5}} onClick={()=>set(x=>Math.min(${v+5},x+${v+1}))}>Add</button><button disabled={n===0} onClick={()=>set(x=>Math.max(0,x-${v+1}))}>Remove</button><button onClick={()=>set(${v})}>Reset</button></section>;`,
 test:`assert.equal(view.getByRole('status').textContent,'${v}');fireEvent.click(view.getByText('Add'));assert.equal(view.getByRole('status').textContent,'${Math.min(v+5,2*v+1)}');for(let i=0;i<10;i++)fireEvent.click(view.getByText('Remove'));assert.equal(view.getByRole('status').textContent,'0');assert.equal(view.getByText('Remove').disabled,true);fireEvent.click(view.getByText('Reset'));assert.equal(view.getByRole('status').textContent,'${v}');`
}));
family('Validated text submission',v=>({
 spec:`Controlled Name field. Submit disabled until trimmed name has at least ${v+2} characters. Submit stores trimmed name in output and clears the field; empty output initially.`,
 code:`const [text,set]=useState(''),[saved,save]=useState('');return <form onSubmit={e=>{e.preventDefault();if(text.trim().length>=${v+2}){save(text.trim());set('');}}}><label>Name<input value={text} onChange={e=>set(e.target.value)}/></label><button disabled={text.trim().length<${v+2}}>Submit</button><output>{saved}</output></form>;`,
 test:`assert.equal(view.getByText('Submit').disabled,true);fireEvent.change(view.getByLabelText('Name'),{target:{value:' ${'a'.repeat(v+2)} '}});assert.equal(view.getByText('Submit').disabled,false);fireEvent.click(view.getByText('Submit'));assert.equal(view.getByRole('status').textContent,'${'a'.repeat(v+2)}');assert.equal(view.getByLabelText('Name').value,'');`
}));
family('Filtered product list',v=>({
 spec:`Show props.items strings in a list; Search is case-insensitive ${v%2?'prefix':'substring'} search. ${v>=2?'Trim the query.':'Preserve query whitespace.'} Empty query shows all. Show count in output; never mutate items.`,
 code:`const [q,set]=useState('');const query=${v>=2?'q.trim()':'q'}.toLowerCase();const filtered=items.filter(x=>x.toLowerCase().${v%2?'startsWith':'includes'}(query));return <section><label>Search<input value={q} onChange={e=>set(e.target.value)}/></label><output>{filtered.length}</output><ul>{filtered.map((x,i)=><li key={i}>{x}</li>)}</ul></section>;`,
 props:{items:['Alpha','Beta','Alphabet']},
 test:`assert.equal(view.getAllByRole('listitem').length,3);fireEvent.change(view.getByLabelText('Search'),{target:{value:'ALP'}});assert.equal(view.getAllByRole('listitem').length,2);fireEvent.change(view.getByLabelText('Search'),{target:{value:'zz'}});assert.equal(view.queryAllByRole('listitem').length,0);assert.equal(view.getByRole('status').textContent,'0');`
}));
family('Exclusive accordion',v=>({
 spec:`Three sections One,Two,Three, initially section ${v%3+1} open. Buttons expose aria-expanded, opening another closes previous; clicking current closes it. Content is unmounted while closed.`,
 code:`const [open,set]=useState(${v%3});return <section>{['One','Two','Three'].map((name,i)=><div key={name}><button aria-expanded={open===i} onClick={()=>set(x=>x===i?null:i)}>{name}</button>{open===i&&<p>{name} content</p>}</div>)}</section>;`,
 test:`assert.equal(view.getByText('${['One','Two','Three'][v%3]}').getAttribute('aria-expanded'),'true');fireEvent.click(view.getByText('${['One','Two','Three'][(v+1)%3]}'));assert.equal(view.queryByText('${['One','Two','Three'][v%3]} content'),null);assert.ok(view.getByText('${['One','Two','Three'][(v+1)%3]} content'));fireEvent.click(view.getByText('${['One','Two','Three'][(v+1)%3]}'));assert.equal(view.queryAllByText(/content$/).length,0);`
}));
family('Accessible tab selection',v=>({
 spec:`Three tabs Red,Green,Blue, initial ${v%3}. Click or ArrowRight/ArrowLeft selects and focuses a tab, wrapping at ends. Expose tablist, tab, aria-selected and one tabpanel. Roving tabIndex.`,
 code:`const [index,set]=useState(${v%3});const refs=useRef([]);const names=['Red','Green','Blue'];return <section><div role="tablist">{names.map((name,i)=><button key={name} ref={el=>{refs.current[i]=el;}} role="tab" tabIndex={index===i?0:-1} aria-selected={index===i} onClick={()=>set(i)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:2))%3;set(next);refs.current[next].focus();}}}>{name}</button>)}</div><div role="tabpanel">{names[index]}</div></section>;`,
 test:`const tabs=view.getAllByRole('tab');assert.equal(view.getByRole('tabpanel').textContent,'${['Red','Green','Blue'][v%3]}');fireEvent.keyDown(tabs[${v%3}],{key:'ArrowRight'});assert.equal(view.getByRole('tabpanel').textContent,'${['Red','Green','Blue'][(v+1)%3]}');assert.equal(document.activeElement,tabs[${(v+1)%3}]);fireEvent.click(tabs[0]);assert.equal(tabs[0].getAttribute('aria-selected'),'true');`
}));
family('Checklist selection cap',v=>({
 spec:`Render four checkboxes A–D. Allow at most ${1+v%3} selections. Disable unchecked boxes when cap reached but keep selected boxes enabled. Output comma-separated selected labels in click order.`,
 code:`const [selected,set]=useState([]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={!selected.includes(x)&&selected.length>=${1+v%3}} onChange={()=>set(old=>old.includes(x)?old.filter(y=>y!==x):[...old,x])}/></label>)}<output>{selected.join(',')}</output></section>;`,
 test:`const boxes=view.getAllByRole('checkbox');assert.equal(view.getByRole('status').textContent,'');for(let i=0;i<${1+v%3};i++)fireEvent.click(boxes[i]);assert.equal(boxes[3].disabled,true);assert.equal(boxes[0].disabled,false);fireEvent.click(boxes[0]);assert.equal(boxes[3].disabled,false);`
}));
family('Stable sortable table',v=>({
 spec:`Props rows {id,name,score}; default order by ${v%2?'score':'name'} ascending. Name/Score header buttons choose ascending column; clicking current reverses. Preserve original tie order. Display data in accessible table.`,
 code:`const [sort,set]=useState({key:'${v%2?'score':'name'}',desc:false});const sorted=rows.map((row,i)=>({row,i})).sort((a,b)=>{const x=a.row[sort.key],y=b.row[sort.key];const c=x<y?-1:x>y?1:0;return c?(sort.desc?-c:c):a.i-b.i;});const choose=key=>set(s=>({key,desc:s.key===key?!s.desc:false}));return <table><thead><tr><th><button onClick={()=>choose('name')}>Name</button></th><th><button onClick={()=>choose('score')}>Score</button></th></tr></thead><tbody>{sorted.map(({row})=><tr key={row.id}><td>{row.name}</td><td>{row.score}</td></tr>)}</tbody></table>;`,
 props:{rows:[{id:'a',name:'Zoe',score:1},{id:'b',name:'Ada',score:3},{id:'c',name:'Bo',score:2}]},
 test:`const names=()=>view.getAllByRole('row').slice(1).map(r=>r.cells[0].textContent);assert.deepEqual(names(),${JSON.stringify(v%2?['Zoe','Bo','Ada']:['Ada','Bo','Zoe'])});fireEvent.click(view.getByText('Score'));assert.deepEqual(names(),${JSON.stringify(v%2?['Ada','Bo','Zoe']:['Zoe','Bo','Ada'])});fireEvent.click(view.getByText('Score'));assert.deepEqual(names(),${JSON.stringify(v%2?['Zoe','Bo','Ada']:['Ada','Bo','Zoe'])});`
}));
family('Paged list controls',v=>({
 spec:`Render props.items with page size ${v+1}; page starts1. Prev/Next disabled at boundaries, page output. Empty input shows page1 and no rows.`,
 code:`const [page,set]=useState(1);const pages=Math.max(1,Math.ceil(items.length/${v+1}));const current=Math.min(page,pages);return <section><ul>{items.slice((current-1)*${v+1},current*${v+1}).map((x,i)=><li key={i}>{x}</li>)}</ul><button disabled={current===1} onClick={()=>set(current-1)}>Prev</button><output>{current}</output><button disabled={current===pages} onClick={()=>set(current+1)}>Next</button></section>;`,
 props:{items:['a','b','c','d','e','f','g']},
 test:`assert.equal(view.getByText('Prev').disabled,true);assert.equal(view.getAllByRole('listitem').length,${v+1});fireEvent.click(view.getByText('Next'));assert.equal(view.getByRole('status').textContent,'2');for(let i=0;i<10;i++)fireEvent.click(view.getByText('Next'));assert.equal(view.getByText('Next').disabled,true);fireEvent.click(view.getByText('Prev'));assert.equal(view.getByText('Next').disabled,false);`
}));
family('Editable label with cancel',v=>({
 spec:`Initially show label 'Draft ${v}'. Edit opens Name input initialized from saved value. Save trims and commits only nonempty input; Cancel discards draft. Enter submits; Escape cancels.`,
 code:`const [saved,save]=useState('Draft ${v}'),[draft,set]=useState(''),[editing,edit]=useState(false);return editing?<form onSubmit={e=>{e.preventDefault();if(draft.trim()){save(draft.trim());edit(false);}}}><label>Name<input value={draft} onChange={e=>set(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')edit(false);}}/></label><button disabled={!draft.trim()}>Save</button><button type="button" onClick={()=>edit(false)}>Cancel</button></form>:<section><output>{saved}</output><button onClick={()=>{set(saved);edit(true);}}>Edit</button></section>;`,
 test:`assert.equal(view.getByRole('status').textContent,'Draft ${v}');fireEvent.click(view.getByText('Edit'));fireEvent.change(view.getByLabelText('Name'),{target:{value:'changed'}});fireEvent.click(view.getByText('Cancel'));assert.equal(view.getByRole('status').textContent,'Draft ${v}');fireEvent.click(view.getByText('Edit'));fireEvent.change(view.getByLabelText('Name'),{target:{value:' saved '}});fireEvent.click(view.getByText('Save'));assert.equal(view.getByRole('status').textContent,'saved');`
}));
family('Confirm destructive local action',v=>({
 spec:`Display ${v+1} local records count in output. Delete opens labelled dialog 'Confirm removal'. Cancel closes without change; Confirm sets count0 and closes. No external operations. Delete disabled after count0.`,
 code:`const [count,set]=useState(${v+1}),[open,toggle]=useState(false);return <section><output>{count}</output><button disabled={!count} onClick={()=>toggle(true)}>Delete</button>{open&&<div role="dialog" aria-label="Confirm removal"><p>Remove local records?</p><button onClick={()=>toggle(false)}>Cancel</button><button onClick={()=>{set(0);toggle(false);}}>Confirm</button></div>}</section>;`,
 test:`fireEvent.click(view.getByText('Delete'));assert.ok(view.getByRole('dialog'));fireEvent.click(view.getByText('Cancel'));assert.equal(view.getByRole('status').textContent,'${v+1}');fireEvent.click(view.getByText('Delete'));fireEvent.click(view.getByText('Confirm'));assert.equal(view.queryByRole('dialog'),null);assert.equal(view.getByRole('status').textContent,'0');assert.equal(view.getByText('Delete').disabled,true);`
}));
family('Reducer undoable text',v=>({
 spec:`Text starts 'v${v}'. A controlled Text input commits each change as a history entry. Undo/Redo navigate entries; editing after Undo discards redo. Disable unavailable buttons. Implement useReducer.`,
 code:`const [s,dispatch]=useReducer((s,a)=>{if(a.type==='edit')return {values:[...s.values.slice(0,s.index+1),a.value],index:s.index+1};if(a.type==='undo')return {...s,index:Math.max(0,s.index-1)};return {...s,index:Math.min(s.values.length-1,s.index+1)};},{values:['v${v}'],index:0});return <section><label>Text<input value={s.values[s.index]} onChange={e=>dispatch({type:'edit',value:e.target.value})}/></label><button disabled={s.index===0} onClick={()=>dispatch({type:'undo'})}>Undo</button><button disabled={s.index===s.values.length-1} onClick={()=>dispatch({type:'redo'})}>Redo</button></section>;`,
 test:`const input=view.getByLabelText('Text');assert.equal(input.value,'v${v}');fireEvent.change(input,{target:{value:'a'}});fireEvent.change(input,{target:{value:'b'}});fireEvent.click(view.getByText('Undo'));assert.equal(input.value,'a');fireEvent.click(view.getByText('Redo'));assert.equal(input.value,'b');fireEvent.click(view.getByText('Undo'));fireEvent.change(input,{target:{value:'c'}});assert.equal(view.getByText('Redo').disabled,true);`
}));
family('Password visibility and length',v=>({
 spec:`Controlled Password input, initially hidden. Show/Hide toggles type without clearing value. Output 'short' until length${v+4}, then 'ready'. Toggle must have type button.`,
 code:`const [text,set]=useState(''),[visible,toggle]=useState(false);return <section><label>Password<input type={visible?'text':'password'} value={text} onChange={e=>set(e.target.value)}/></label><button type="button" onClick={()=>toggle(x=>!x)}>{visible?'Hide':'Show'}</button><output>{text.length>=${v+4}?'ready':'short'}</output></section>;`,
 test:`const input=view.getByLabelText('Password');assert.equal(input.type,'password');fireEvent.change(input,{target:{value:'${'x'.repeat(v+4)}'}});assert.equal(view.getByRole('status').textContent,'ready');fireEvent.click(view.getByText('Show'));assert.equal(input.type,'text');assert.equal(input.value,'${'x'.repeat(v+4)}');fireEvent.click(view.getByText('Hide'));assert.equal(input.type,'password');`
}));
family('Select all checklist',v=>({
 spec:`Render ${v+2} item checkboxes labelled Item1..N, plus All. All selects/deselects every item. All checkbox indeterminate when partially selected, checked only when all selected.`,
 code:`const [selected,set]=useState([]);const allRef=useRef(null);const count=${v+2};useEffect(()=>{allRef.current.indeterminate=selected.length>0&&selected.length<count;},[selected,count]);return <section><label>All<input ref={allRef} type="checkbox" checked={selected.length===count} onChange={()=>set(selected.length===count?[]:Array.from({length:count},(_,i)=>i))}/></label>{Array.from({length:count},(_,i)=><label key={i}>Item{i+1}<input type="checkbox" checked={selected.includes(i)} onChange={()=>set(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])}/></label>)}</section>;`,
 test:`const all=view.getByLabelText('All');fireEvent.click(view.getByLabelText('Item1'));assert.equal(all.indeterminate,true);assert.equal(all.checked,false);fireEvent.click(all);assert.equal(view.getByLabelText('Item${v+2}').checked,true);assert.equal(all.indeterminate,false);fireEvent.click(all);assert.equal(view.getByLabelText('Item1').checked,false);`
}));
family('Context preference provider',v=>({
 spec:`Create Context inside module. Provider starts theme '${v%2?'dark':'light'}'. Nested child displays theme in output; Toggle switches theme. Avoid prop drilling for theme and toggle callback.`,
 pre:`const ThemeContext=React.createContext(null);function ThemeChild(){const {theme,toggle}=React.useContext(ThemeContext);return <section><output>{theme}</output><button onClick={toggle}>Toggle</button></section>;}`,
 code:`const [theme,set]=useState('${v%2?'dark':'light'}');return <ThemeContext.Provider value={{theme,toggle:()=>set(x=>x==='light'?'dark':'light')}}><ThemeChild/></ThemeContext.Provider>;`,
 test:`assert.equal(view.getByRole('status').textContent,'${v%2?'dark':'light'}');fireEvent.click(view.getByText('Toggle'));assert.equal(view.getByRole('status').textContent,'${v%2?'light':'dark'}');fireEvent.click(view.getByText('Toggle'));assert.equal(view.getByRole('status').textContent,'${v%2?'dark':'light'}');`
}));
family('Keyboard escape cleanup',v=>({
 spec:`Panel initially open, output 'open'/'closed'. Global document Escape key closes panel; Open reopens. Register listener in effect and remove on unmount. Other keys ignored. Label panel 'Panel ${v}'.`,
 code:`const [open,set]=useState(true);useEffect(()=>{const handler=e=>{if(e.key==='Escape')set(false);};document.addEventListener('keydown',handler);return ()=>document.removeEventListener('keydown',handler);},[]);return <section><output>{open?'open':'closed'}</output>{open&&<div aria-label="Panel ${v}">Panel content</div>}<button onClick={()=>set(true)}>Open</button></section>;`,
 test:`assert.equal(view.getByRole('status').textContent,'open');fireEvent.keyDown(document,{key:'x'});assert.equal(view.getByRole('status').textContent,'open');fireEvent.keyDown(document,{key:'Escape'});assert.equal(view.getByRole('status').textContent,'closed');fireEvent.click(view.getByText('Open'));assert.equal(view.getByRole('status').textContent,'open');view.unmount();fireEvent.keyDown(document,{key:'Escape'});assert.equal(document.body.textContent,'');`
}));
family('Fake async request state',v=>({
 spec:`Props load():Promise<string>. Load button starts request, disabled while pending; output idle/loading/response, role alert on rejection. Retry enabled after failure. Ignore result after unmount. Initial idle. Scenario${v} uses injected fake service only.`,
 code:`const [state,set]=useState({status:'idle',value:''});const live=useRef(true);useEffect(()=>{live.current=true;return ()=>{live.current=false;};},[]);async function run(){set({status:'loading',value:''});try{const value=await load();if(live.current)set({status:'done',value});}catch(error){if(live.current)set({status:'error',value:error.message});}}return <section><button disabled={state.status==='loading'} onClick={run}>Load</button><output>{state.status==='done'?state.value:state.status}</output>{state.status==='error'&&<p role="alert">{state.value}</p>}</section>;`,
 setup:`let resolve;props.load=()=>new Promise(r=>{resolve=r;});`,
 test:`assert.equal(view.getByRole('status').textContent,'idle');fireEvent.click(view.getByText('Load'));assert.equal(view.getByText('Load').disabled,true);await act(async()=>resolve('result${v}'));assert.equal(view.getByRole('status').textContent,'result${v}');assert.equal(view.getByText('Load').disabled,false);view.rerender(React.createElement(Component,{load:()=>Promise.reject(new Error('offline'))}));await act(async()=>fireEvent.click(view.getByText('Load')));assert.equal(view.getByRole('alert').textContent,'offline');`
}));
family('Ref focus controls',v=>({
 spec:`Two labelled inputs First and Second. Focus button focuses ${v%2?'Second':'First'}; Clear empties both using controlled state and focuses First. Preserve entered text when focusing.`,
 code:`const [a,setA]=useState(''),[b,setB]=useState('');const first=useRef(null),second=useRef(null);return <section><label>First<input ref={first} value={a} onChange={e=>setA(e.target.value)}/></label><label>Second<input ref={second} value={b} onChange={e=>setB(e.target.value)}/></label><button onClick={()=>${v%2?'second':'first'}.current.focus()}>Focus</button><button onClick={()=>{setA('');setB('');first.current.focus();}}>Clear</button></section>;`,
 test:`fireEvent.change(view.getByLabelText('First'),{target:{value:'a'}});fireEvent.change(view.getByLabelText('Second'),{target:{value:'b'}});fireEvent.click(view.getByText('Focus'));assert.equal(document.activeElement,view.getByLabelText('${v%2?'Second':'First'}'));assert.equal(view.getByLabelText('First').value,'a');fireEvent.click(view.getByText('Clear'));assert.equal(view.getByLabelText('Second').value,'');assert.equal(document.activeElement,view.getByLabelText('First'));`
}));
family('Dependent option selection',v=>({
 spec:`Region select choices North/South, initial ${v%2?'South':'North'}. City choices North: A,B; South: C,D. Region change resets city to first valid option. Output Region:City; City controlled select.`,
 code:`const cities={North:['A','B'],South:['C','D']};const [region,setRegion]=useState('${v%2?'South':'North'}'),[city,setCity]=useState('${v%2?'C':'A'}');return <section><label>Region<select value={region} onChange={e=>{setRegion(e.target.value);setCity(cities[e.target.value][0]);}}>{Object.keys(cities).map(x=><option key={x}>{x}</option>)}</select></label><label>City<select value={city} onChange={e=>setCity(e.target.value)}>{cities[region].map(x=><option key={x}>{x}</option>)}</select></label><output>{region}:{city}</output></section>;`,
 test:`assert.equal(view.getByRole('status').textContent,'${v%2?'South:C':'North:A'}');fireEvent.change(view.getByLabelText('City'),{target:{value:'${v%2?'D':'B'}'}});assert.equal(view.getByRole('status').textContent,'${v%2?'South:D':'North:B'}');fireEvent.change(view.getByLabelText('Region'),{target:{value:'${v%2?'North':'South'}'}});assert.equal(view.getByRole('status').textContent,'${v%2?'North:A':'South:C'}');assert.equal(view.getByLabelText('City').value,'${v%2?'A':'C'}');`
}));
family('Tag editor with duplicate policy',v=>({
 spec:`Input Tag and Add button. Trim values, reject empty and ${v%2?'case-insensitive':'case-sensitive'} duplicates; cap${v+2} tags. Clear input only on successful add. Each tag has Remove LABEL button.`,
 code:`const [text,set]=useState(''),[tags,save]=useState([]);function add(){const value=text.trim();if(!value||tags.length>=${v+2}||tags.some(x=>${v%2?'x.toLowerCase()===value.toLowerCase()':'x===value'}))return;save(old=>[...old,value]);set('');}return <section><label>Tag<input value={text} onChange={e=>set(e.target.value)}/></label><button onClick={add}>Add</button><ul>{tags.map(tag=><li key={tag}>{tag}<button aria-label={'Remove '+tag} onClick={()=>save(old=>old.filter(x=>x!==tag))}>Remove</button></li>)}</ul></section>;`,
 test:`const input=view.getByLabelText('Tag');fireEvent.change(input,{target:{value:' js '}});fireEvent.click(view.getByText('Add'));assert.equal(view.getAllByRole('listitem').length,1);assert.equal(input.value,'');fireEvent.change(input,{target:{value:'js'}});fireEvent.click(view.getByText('Add'));assert.equal(view.getAllByRole('listitem').length,1);fireEvent.click(view.getByLabelText('Remove js'));assert.equal(view.queryAllByRole('listitem').length,0);`
}));
family('Two-stage form wizard',v=>({
 spec:`Step1 Name input requires ${v+1} trimmed characters to enable Next. Step2 review name with Back and Finish. Back retains name. Finish renders output 'Saved: NAME' and removes form controls.`,
 code:`const [step,setStep]=useState(1),[name,set]=useState('');if(step===3)return <output>Saved: {name.trim()}</output>;if(step===2)return <section><p>Review: {name.trim()}</p><button onClick={()=>setStep(1)}>Back</button><button onClick={()=>setStep(3)}>Finish</button></section>;return <section><label>Name<input value={name} onChange={e=>set(e.target.value)}/></label><button disabled={name.trim().length<${v+1}} onClick={()=>setStep(2)}>Next</button></section>;`,
 test:`assert.equal(view.getByText('Next').disabled,true);fireEvent.change(view.getByLabelText('Name'),{target:{value:'${'n'.repeat(v+1)}'}});fireEvent.click(view.getByText('Next'));assert.ok(view.getByText('Review: ${'n'.repeat(v+1)}'));fireEvent.click(view.getByText('Back'));assert.equal(view.getByLabelText('Name').value,'${'n'.repeat(v+1)}');fireEvent.click(view.getByText('Next'));fireEvent.click(view.getByText('Finish'));assert.equal(view.getByRole('status').textContent,'Saved: ${'n'.repeat(v+1)}');`
}));
function emit(name,start,count){
 const dir=path.join(root,name);if(fs.existsSync(dir))throw new Error('Refusing to overwrite '+dir);
 for(const part of ['starters','solutions','tests'])fs.mkdirSync(path.join(dir,part),{recursive:true});
 const manifest=[];
 for(let i=0;i<count;i++){
  const id=start+i,famil=families[Math.floor(i/5)%families.length],v=i%5,task=famil.create(v);
  const mixed=name==='mixed-react';
  const requirements=(mixed?'Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. ':'')+task.spec;
  const header=`// ${id} ${famil.name} / scenario ${v+1}\n// ${requirements}\n// Run: node ${name}/verify.cjs --id=${id} [--starters]\n`;
  const imports=`import React,{useState,useEffect,useReducer,useRef} from 'react';\n`;
  const solution=imports+(task.pre||'')+`\nexport default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){${task.code}}\n`;
  const starter=imports+`export default function Exercise(props){return <p>TODO exercise ${id}</p>;}\n`;
  fs.writeFileSync(path.join(dir,'solutions',id+'.jsx'),header+solution);
  fs.writeFileSync(path.join(dir,'starters',id+'.jsx'),header+starter);
  const test=`const assert=require('node:assert/strict');\nmodule.exports=async({Component,React,render,fireEvent,act})=>{\nconst props=${JSON.stringify(task.props||{})};${task.setup||''}\nconst view=render(React.createElement(Component,props));\n${task.test}\n${mixed?`view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();`:''}\n};\n`;
  fs.writeFileSync(path.join(dir,'tests',id+'.cjs'),test);
  manifest.push({id,tech:'react',title:famil.name+' / scenario '+(v+1),starter:'starters/'+id+'.jsx',solution:'solutions/'+id+'.jsx',test:'tests/'+id+'.cjs'});
 }
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));
 fs.writeFileSync(path.join(dir,'verify.cjs'),`'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom'),esbuild=require('esbuild');
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/'});
for(const key of ['window','document','navigator','HTMLElement','HTMLInputElement','Node','Event','KeyboardEvent','MutationObserver'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react');const {render,fireEvent,cleanup,act}=require('@testing-library/react');
const manifest=require('./manifest.json');assert.equal(manifest.length,${count});assert.equal(new Set(manifest.map(x=>x.id)).size,${count});
const option=process.argv.find(a=>a.startsWith('--id='));const entries=option?manifest.filter(x=>x.id===Number(option.slice(5))):manifest;
if(!entries.length)throw new Error('Unknown id');const mode=process.argv.includes('--starters')?'starter':'solution';
(async()=>{let passed=0,failed=0;for(const row of entries){try{
 for(const field of ['starter','solution'])await esbuild.transform(fs.readFileSync(path.join(__dirname,row[field]),'utf8'),{loader:'jsx',jsx:'automatic'});
 const result=await esbuild.build({entryPoints:[path.join(__dirname,row[mode])],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',packages:'external',logLevel:'silent'});
 const Module=require('node:module');const m=new Module(path.join(__dirname,'runtime.cjs'),module);m.filename=path.join(__dirname,'runtime.cjs');m.paths=module.paths;m._compile(result.outputFiles[0].text,m.filename);
 await require(path.join(__dirname,row.test))({Component:m.exports.default,React,render,fireEvent,act});passed++;console.log('PASS '+row.id+' '+row.title);
 }catch(e){failed++;console.error('FAIL '+row.id+' '+e.stack);}finally{cleanup();document.body.innerHTML='';}}
 console.log(mode+' DOM interaction tests: '+passed+' passed, '+failed+' failed.');dom.window.close();process.exitCode=failed?1:0;
})().catch(e=>{console.error(e);dom.window.close();process.exitCode=1;});
`);
 fs.writeFileSync(path.join(dir,'GUIDE.txt'),`${name.toUpperCase()}\n\n${count} React scenario exercises across ${Math.ceil(count/5)} interaction families. Variants revisit a family with changed constraints; these are not ${count} unrelated components.\n\nFrom unionboot: node ${name}/verify.cjs\nPractice one: node ${name}/verify.cjs --starters --id=${start}\n\nTests use jsdom, React act, accessible queries and actual events. No external APIs.\nEach exercise exports a component; read tests to see example props. Import a starter in your own React application for a visual preview. No preview server is included.\nDo not copy reference solutions into starters unless you intentionally want solved files.\n\n`+manifest.map(x=>x.id+' '+x.title).join('\n'));
 console.log('Created '+name+': '+count+' React exercises with DOM tests');
}
emit('react',284,100);emit('mixed-react',519,65);
