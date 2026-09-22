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
click('Save');assert.equal(view.getByRole('alert').textContent,'Enter 10 digits');change('Phone',' 212.555-0199 ');click('Save');assert.equal(status(),'(212) 555-0199');assert.equal(field('Phone').value,' 212.555-0199 ');assert.equal(view.queryByRole('alert'),null);change('Phone','123');click('Save');assert.equal(status(),'(212) 555-0199');assert.equal(field('Phone').value,'123');assert.ok(view.getByRole('alert'));change('Phone','01234567890');click('Save');assert.ok(view.getByRole('alert'));change('Phone','0123456789');click('Save');assert.equal(status(),'(012) 345-6789');
};
