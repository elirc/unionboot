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
assert.equal(button('Save').disabled,true);assert.equal(button('Discard').disabled,true);change('Name','   ');assert.equal(button('Save').disabled,true);click('Discard');assert.equal(field('Name').value,'Ada');change('Name',' Bo ');click('Save');assert.equal(status(),'Bo');assert.equal(field('Name').value,'Bo');change('Name','Cy');click('Discard');assert.equal(field('Name').value,'Bo');change('Name',' Bo ');assert.equal(button('Save').disabled,true);assert.equal(button('Discard').disabled,false);
};
