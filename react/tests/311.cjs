const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const boxes=view.getAllByRole('checkbox');assert.equal(view.getByRole('status').textContent,'');for(let i=0;i<3;i++)fireEvent.click(boxes[i]);assert.equal(boxes[3].disabled,true);assert.equal(boxes[0].disabled,false);fireEvent.click(boxes[0]);assert.equal(boxes[3].disabled,false);

};
