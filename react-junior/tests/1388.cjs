const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"records":[{"id":1,"title":"Alpha report","summary":"A detail"},{"id":2,"title":"Alphabet guide","summary":"B detail"},{"id":3,"title":"Zebra facts","summary":"C detail"}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'3');fireEvent.click(view.getByRole('button',{name:'Alpha report'}));assert.ok(view.getByText('A detail'));fireEvent.click(view.getByRole('button',{name:'Alphabet guide'}));assert.ok(view.getByText('B detail'));change('Search','ALP');assert.equal(status(),'2');assert.ok(view.getByText('A detail'));change('Search','zzz');assert.equal(status(),'0');assert.equal(view.queryAllByRole('listitem').length,0);change('Search','');assert.equal(view.getByRole('button',{name:'Alpha report'}).getAttribute('aria-expanded'),'true');assert.ok(view.getByText('A detail'));
};
