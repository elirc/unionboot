const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'open');fireEvent.keyDown(document,{key:'x'});assert.equal(view.getByRole('status').textContent,'open');fireEvent.keyDown(document,{key:'Escape'});assert.equal(view.getByRole('status').textContent,'closed');fireEvent.click(view.getByText('Open'));assert.equal(view.getByRole('status').textContent,'open');view.unmount();fireEvent.keyDown(document,{key:'Escape'});assert.equal(document.body.textContent,'');

};
