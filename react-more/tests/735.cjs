'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
const requests=[];props.load=()=>new Promise((resolve,reject)=>requests.push({resolve,reject}));
freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const state=()=>view.getByLabelText('State').textContent,data=()=>view.getByLabelText('Data').textContent;eq(state(),'idle');eq(data(),'');eq(button('Cancel').disabled,true);click('Load');eq(state(),'loading');eq(button('Load').disabled,false);click('Load');eq(requests.length,2);await act(async()=>requests[0].resolve('stale'));eq(state(),'loading');eq(data(),'');await act(async()=>requests[requests.length-1].resolve('good'));eq(state(),'done');eq(data(),'good');click('Load');eq(data(),"");await act(async()=>requests[requests.length-1].reject(new Error('offline')));eq(state(),'error');eq(view.getByRole('alert').textContent,'offline');eq(data(),"");click('Load');eq(view.queryByRole('alert'),null);await act(async()=>requests[requests.length-1].reject(null));eq(view.getByRole('alert').textContent,"Unavailable");click('Load');const canceled=requests[requests.length-1];click('Cancel');eq(state(),'idle');await act(async()=>canceled.resolve('late'));eq(state(),'idle');eq(data(),"");click('Load');const old=requests[requests.length-1];click('Load');await act(async()=>requests[requests.length-1].resolve('new'));await act(async()=>old.reject(new Error('old error')));eq(state(),'done');eq(data(),'new');eq(view.queryByRole('alert'),null);click('Load');const late=requests[requests.length-1];view.unmount();await act(async()=>late.resolve('unmounted'));eq(document.body.textContent,'');
} finally {for(const restore of after.reverse())restore();}
};
