const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(button('Import').disabled,true);change('Names',' Ada, ,Bo,ADA, cy,bo ');assert.deepEqual(view.getAllByRole('listitem').map(x=>x.textContent),['Ada','Bo','cy']);click('Import');assert.equal(status(),'Ada|Bo|cy');assert.equal(field('Names').value,'');assert.equal(view.queryAllByRole('listitem').length,0);change('Names','a,b,c,d,e');assert.equal(button('Import').disabled,true);assert.equal(view.getByRole('alert').textContent,'Maximum 4 names');fireEvent.submit(field('Names').closest('form'));assert.equal(status(),'Ada|Bo|cy');change('Names',', ,');assert.equal(button('Import').disabled,true);
};
