const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByText('One').getAttribute('aria-expanded'),'true');fireEvent.click(view.getByText('Two'));assert.equal(view.queryByText('One content'),null);assert.ok(view.getByText('Two content'));fireEvent.click(view.getByText('Two'));assert.equal(view.queryAllByText(/content$/).length,0);

};
