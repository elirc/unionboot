const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};let calls=0;const pending=[];props.fetchUser=()=>{calls++;return new Promise((resolve,reject)=>pending.push({resolve,reject}));};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'loading');assert.equal(calls,1);await act(async()=>pending[0].resolve({name:'Ada'}));assert.equal(status(),'Ada');view.rerender(React.createElement(Component,{fetchUser:props.fetchUser,noise:1}));assert.equal(calls,1);assert.equal(status(),'Ada');view.unmount();const second=render(React.createElement(Component,{fetchUser:props.fetchUser}));assert.equal(calls,2);await act(async()=>pending[1].reject(new Error('offline')));assert.equal(second.getByRole('alert').textContent,'offline');second.unmount();const third=render(React.createElement(Component,{fetchUser:props.fetchUser}));assert.equal(calls,3);third.unmount();await act(async()=>pending[2].resolve({name:'late'}));assert.equal(document.body.textContent,'');
};
