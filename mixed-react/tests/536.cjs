const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByText('Three').getAttribute('aria-expanded'),'true');fireEvent.click(view.getByText('One'));assert.equal(view.queryByText('Three content'),null);assert.ok(view.getByText('One content'));fireEvent.click(view.getByText('One'));assert.equal(view.queryAllByText(/content$/).length,0);
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
