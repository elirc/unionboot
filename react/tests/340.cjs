const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const input=view.getByLabelText('Password');assert.equal(input.type,'password');fireEvent.change(input,{target:{value:'xxxxx'}});assert.equal(view.getByRole('status').textContent,'ready');fireEvent.click(view.getByText('Show'));assert.equal(input.type,'text');assert.equal(input.value,'xxxxx');fireEvent.click(view.getByText('Hide'));assert.equal(input.type,'password');

};
