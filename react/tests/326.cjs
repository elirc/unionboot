const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'Draft 2');fireEvent.click(view.getByText('Edit'));fireEvent.change(view.getByLabelText('Name'),{target:{value:'changed'}});fireEvent.click(view.getByText('Cancel'));assert.equal(view.getByRole('status').textContent,'Draft 2');fireEvent.click(view.getByText('Edit'));fireEvent.change(view.getByLabelText('Name'),{target:{value:' saved '}});fireEvent.click(view.getByText('Save'));assert.equal(view.getByRole('status').textContent,'saved');

};
