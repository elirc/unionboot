const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const boxes=view.getAllByRole('checkbox');assert.equal(view.getByRole('status').textContent,'');for(let i=0;i<1;i++)fireEvent.click(boxes[i]);assert.equal(boxes[3].disabled,true);assert.equal(boxes[0].disabled,false);fireEvent.click(boxes[0]);assert.equal(boxes[3].disabled,false);
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
