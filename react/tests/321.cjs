const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={"items":["a","b","c","d","e","f","g"]};
const view=render(React.createElement(Component,props));
assert.equal(view.getByText('Prev').disabled,true);assert.equal(view.getAllByRole('listitem').length,3);fireEvent.click(view.getByText('Next'));assert.equal(view.getByRole('status').textContent,'2');for(let i=0;i<10;i++)fireEvent.click(view.getByText('Next'));assert.equal(view.getByText('Next').disabled,true);fireEvent.click(view.getByText('Prev'));assert.equal(view.getByText('Next').disabled,false);

};
