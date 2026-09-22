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
click('Submit');assert.equal(view.getByRole('alert').textContent,'Enter a name Enter a valid email Enter a message');assert.equal(document.activeElement,field('Name'));change('Name','Ada');change('Email','nope');change('Message','hi');click('Submit');assert.equal(view.getByRole('alert').textContent,'Enter a valid email');assert.equal(document.activeElement,field('Email'));change('Email','a@b.c');click('Submit');assert.equal(status(),'Sent: Ada');assert.equal(view.queryByRole('alert'),null);assert.equal(field('Name').value,'');
};
