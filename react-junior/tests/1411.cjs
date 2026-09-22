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
change('Note','hello');assert.equal(status('Count'),'5 characters');assert.equal(within(view.getByRole('group',{name:'Preview'})).getByRole('status').textContent,'hello');change('Note','hi!');assert.equal(within(view.getByRole('group',{name:'Preview'})).getByRole('status').textContent,'hi!');click('Clear');assert.equal(field('Note').value,'');assert.equal(status('Count'),'0 characters');
};
