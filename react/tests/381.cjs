const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByText('Next').disabled,true);fireEvent.change(view.getByLabelText('Name'),{target:{value:'nnn'}});fireEvent.click(view.getByText('Next'));assert.ok(view.getByText('Review: nnn'));fireEvent.click(view.getByText('Back'));assert.equal(view.getByLabelText('Name').value,'nnn');fireEvent.click(view.getByText('Next'));fireEvent.click(view.getByText('Finish'));assert.equal(view.getByRole('status').textContent,'Saved: nnn');

};
