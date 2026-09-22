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
assert.equal(button('Remove guest 1').disabled,true);assert.equal(button('Book').disabled,true);change('Guest 1',' Ada ');click('Add guest');change('Guest 2','Bo');click('Add guest');change('Guest 3','Cy');click('Remove guest 2');assert.equal(field('Guest 3').value,'Cy');assert.equal(view.queryByLabelText('Guest 2'),null);click('Book');assert.equal(status(),'Ada, Cy');click('Add guest');assert.ok(field('Guest 4'));assert.equal(button('Book').disabled,true);click('Remove guest 4');click('Remove guest 1');assert.equal(button('Remove guest 3').disabled,true);click('Book');assert.equal(status(),'Cy');
};
