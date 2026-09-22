const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'dark');fireEvent.click(view.getByText('Toggle'));assert.equal(view.getByRole('status').textContent,'light');fireEvent.click(view.getByText('Toggle'));assert.equal(view.getByRole('status').textContent,'dark');

};
