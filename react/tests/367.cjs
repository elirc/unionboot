const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
fireEvent.change(view.getByLabelText('First'),{target:{value:'a'}});fireEvent.change(view.getByLabelText('Second'),{target:{value:'b'}});fireEvent.click(view.getByText('Focus'));assert.equal(document.activeElement,view.getByLabelText('Second'));assert.equal(view.getByLabelText('First').value,'a');fireEvent.click(view.getByText('Clear'));assert.equal(view.getByLabelText('Second').value,'');assert.equal(document.activeElement,view.getByLabelText('First'));

};
