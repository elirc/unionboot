const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const all=view.getByLabelText('All');fireEvent.click(view.getByLabelText('Item1'));assert.equal(all.indeterminate,true);assert.equal(all.checked,false);fireEvent.click(all);assert.equal(view.getByLabelText('Item5').checked,true);assert.equal(all.indeterminate,false);fireEvent.click(all);assert.equal(view.getByLabelText('Item1').checked,false);
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
