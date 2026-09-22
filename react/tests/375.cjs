const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const input=view.getByLabelText('Tag');fireEvent.change(input,{target:{value:' js '}});fireEvent.click(view.getByText('Add'));assert.equal(view.getAllByRole('listitem').length,1);assert.equal(input.value,'');fireEvent.change(input,{target:{value:'js'}});fireEvent.click(view.getByText('Add'));assert.equal(view.getAllByRole('listitem').length,1);fireEvent.click(view.getByLabelText('Remove js'));assert.equal(view.queryAllByRole('listitem').length,0);

};
