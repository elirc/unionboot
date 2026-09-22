const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'North:A');fireEvent.change(view.getByLabelText('City'),{target:{value:'B'}});assert.equal(view.getByRole('status').textContent,'North:B');fireEvent.change(view.getByLabelText('Region'),{target:{value:'South'}});assert.equal(view.getByRole('status').textContent,'South:C');assert.equal(view.getByLabelText('City').value,'C');

};
