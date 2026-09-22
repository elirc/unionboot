const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
fireEvent.click(view.getByText('Delete'));assert.ok(view.getByRole('dialog'));fireEvent.click(view.getByText('Cancel'));assert.equal(view.getByRole('status').textContent,'5');fireEvent.click(view.getByText('Delete'));fireEvent.click(view.getByText('Confirm'));assert.equal(view.queryByRole('dialog'),null);assert.equal(view.getByRole('status').textContent,'0');assert.equal(view.getByText('Delete').disabled,true);

};
