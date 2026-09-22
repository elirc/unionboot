const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const input=view.getByLabelText('Text');assert.equal(input.value,'v4');fireEvent.change(input,{target:{value:'a'}});fireEvent.change(input,{target:{value:'b'}});fireEvent.click(view.getByText('Undo'));assert.equal(input.value,'a');fireEvent.click(view.getByText('Redo'));assert.equal(input.value,'b');fireEvent.click(view.getByText('Undo'));fireEvent.change(input,{target:{value:'c'}});assert.equal(view.getByText('Redo').disabled,true);
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
