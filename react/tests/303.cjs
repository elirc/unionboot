const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByText('Two').getAttribute('aria-expanded'),'true');fireEvent.click(view.getByText('Three'));assert.equal(view.queryByText('Two content'),null);assert.ok(view.getByText('Three content'));fireEvent.click(view.getByText('Three'));assert.equal(view.queryAllByText(/content$/).length,0);

};
