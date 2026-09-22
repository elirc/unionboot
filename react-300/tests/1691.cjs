'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const writes=[],removes=[];const values=new Map([['draft',JSON.stringify({version:3,text:'seed'})]]);props.storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{writes.push([k,v]);values.set(k,v);},removeItem:k=>{removes.push(k);values.delete(k);}};
const view=render(React.createElement(Component,props));
const out=name=>view.getByRole('status',{name,exact:true}).textContent;
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const field=name=>view.getByLabelText(name,{exact:true,selector:'input,select,textarea'}),change=(name,value)=>fireEvent.change(field(name),{target:{value}});
const alert=()=>view.getByRole('alert').textContent;
const list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const rowText=name=>within(view.getByRole('list',name===undefined?{}:{name,exact:true})).queryAllByRole('listitem').map(x=>x.querySelector('span')?.textContent??x.textContent);
const submit=()=>fireEvent.submit(view.container.querySelector('form'));
const rerender=p=>view.rerender(React.createElement(Component,p));
const flush=()=>act(async()=>{});
eq(field('Text').value,'seed');eq(writes.length,0);change('Text',' draft ');deep(JSON.parse(values.get('draft')),{version:3,text:" draft "});eq(field('Text').value,' draft ');click('Clear');eq(values.has('draft'),false);deep(removes,['draft']);view.unmount();for(const stored of ['bad',JSON.stringify({version:99,text:'wrong'}),JSON.stringify({version:3,text:7})]){values.set('draft',stored);const next=render(React.createElement(Component,props));eq(within(next.container).getByLabelText('Text',{selector:'input'}).value,'');next.unmount();}const broken=render(React.createElement(Component,{storage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}}}));eq(within(broken.container).getByRole('status',{name:'Storage'}).textContent,'unavailable');fireEvent.change(within(broken.container).getByLabelText('Text',{selector:'input'}),{target:{value:'works'}});eq(within(broken.container).getByRole('status',{name:'Text'}).textContent,'works');broken.unmount();
};
