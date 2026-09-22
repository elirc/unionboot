const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'Draft 1');fireEvent.click(view.getByText('Edit'));fireEvent.change(view.getByLabelText('Name'),{target:{value:'changed'}});fireEvent.click(view.getByText('Cancel'));assert.equal(view.getByRole('status').textContent,'Draft 1');fireEvent.click(view.getByText('Edit'));fireEvent.change(view.getByLabelText('Name'),{target:{value:' saved '}});fireEvent.click(view.getByText('Save'));assert.equal(view.getByRole('status').textContent,'saved');
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
