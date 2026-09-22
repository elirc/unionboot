const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const leaf=()=>within(view.getByRole('group',{name:'Themed box'})).getByRole('status').textContent;assert.equal(leaf(),'light');click('Toggle');assert.equal(leaf(),'dark');click('Toggle');assert.equal(leaf(),'light');view.unmount();const a=render(React.createElement(Component));const b=render(React.createElement(Component));fireEvent.click(within(a.container).getByRole('button',{name:'Toggle'}));assert.equal(within(a.container).getByRole('status').textContent,'dark');assert.equal(within(b.container).getByRole('status').textContent,'light');
};
