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
const section=view.container.firstElementChild;assert.equal(section.firstElementChild.textContent,'Skip to content');assert.equal(section.firstElementChild.getAttribute('href'),'#main');assert.ok(view.getByRole('banner',{name:'Site header'}));assert.ok(view.getByRole('navigation'));assert.ok(view.getByRole('main',{name:'Main content'}));assert.equal(view.getByRole('main').id,'main');assert.ok(view.getByRole('link',{name:'Home'}));assert.ok(view.getByRole('link',{name:'About'}));
};
