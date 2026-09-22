const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByText('Submit').disabled,true);fireEvent.change(view.getByLabelText('Name'),{target:{value:' aaaaaa '}});assert.equal(view.getByText('Submit').disabled,false);fireEvent.click(view.getByText('Submit'));assert.equal(view.getByRole('status').textContent,'aaaaaa');assert.equal(view.getByLabelText('Name').value,'');

};
