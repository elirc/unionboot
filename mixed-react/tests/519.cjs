const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'0');fireEvent.click(view.getByText('Add'));assert.equal(view.getByRole('status').textContent,'1');for(let i=0;i<10;i++)fireEvent.click(view.getByText('Remove'));assert.equal(view.getByRole('status').textContent,'0');assert.equal(view.getByText('Remove').disabled,true);fireEvent.click(view.getByText('Reset'));assert.equal(view.getByRole('status').textContent,'0');
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
