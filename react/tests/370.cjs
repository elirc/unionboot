const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'South:C');fireEvent.change(view.getByLabelText('City'),{target:{value:'D'}});assert.equal(view.getByRole('status').textContent,'South:D');fireEvent.change(view.getByLabelText('Region'),{target:{value:'North'}});assert.equal(view.getByRole('status').textContent,'North:A');assert.equal(view.getByLabelText('City').value,'A');

};
