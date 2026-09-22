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
assert.equal(status(),'closed');click('Open');const dialog=view.getByRole('dialog',{name:'Wizard'});assert.equal(document.activeElement,within(dialog).getByText('First'));within(dialog).getByText('Last').focus();fireEvent.keyDown(within(dialog).getByText('Last'),{key:'Tab'});assert.equal(document.activeElement,within(dialog).getByText('First'));fireEvent.keyDown(within(dialog).getByText('First'),{key:'Tab',shiftKey:true});assert.equal(document.activeElement,within(dialog).getByText('Last'));click('Close');assert.equal(status(),'closed');
};
