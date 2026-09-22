const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={"items":["Alpha","Beta","Alphabet"]};
const view=render(React.createElement(Component,props));
assert.equal(view.getAllByRole('listitem').length,3);fireEvent.change(view.getByLabelText('Search'),{target:{value:'ALP'}});assert.equal(view.getAllByRole('listitem').length,2);fireEvent.change(view.getByLabelText('Search'),{target:{value:'zz'}});assert.equal(view.queryAllByRole('listitem').length,0);assert.equal(view.getByRole('status').textContent,'0');
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
