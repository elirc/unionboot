const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};const requests={};props.fetchUser=id=>new Promise((resolve,reject)=>{requests[id]={resolve,reject};});
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status('User'),'loading');await act(async()=>{});view.rerender(React.createElement(Component,{fetchUser:props.fetchUser,userId:2}));await act(async()=>{});await act(async()=>requests[2].resolve({id:2,name:'Ben'}));assert.equal(status('User'),'Ben');await act(async()=>requests[1].resolve({id:1,name:'Ann'}));assert.equal(status('User'),'Ben');view.rerender(React.createElement(Component,{fetchUser:props.fetchUser,userId:3}));await act(async()=>{});assert.equal(status('User'),'loading');view.rerender(React.createElement(Component,{fetchUser:props.fetchUser,userId:4}));await act(async()=>{});await act(async()=>requests[3].reject(new Error('stale')));assert.equal(view.queryByRole('alert'),null);await act(async()=>requests[4].reject(new Error('offline')));assert.equal(status('User'),'error');assert.equal(view.getByRole('alert').textContent,'offline');view.rerender(React.createElement(Component,{fetchUser:props.fetchUser,userId:5}));await act(async()=>{});assert.equal(view.queryByRole('alert'),null);view.unmount();await act(async()=>requests[5].resolve({id:5,name:'late'}));assert.equal(document.body.textContent,'');
};
