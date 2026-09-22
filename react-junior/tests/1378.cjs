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
assert.equal(view.queryByRole('alert'),null);fireEvent.blur(field('Password'));assert.equal(view.getByRole('alert').textContent,'Use at least 8 characters');assert.equal(field('Password').getAttribute('aria-invalid'),'true');assert.equal(document.getElementById(field('Password').getAttribute('aria-describedby')).textContent,'Use at least 8 characters');change('Password','longpass');assert.equal(view.queryByRole('alert'),null);change('Confirm','wrong');fireEvent.blur(field('Confirm'));assert.equal(view.getByRole('alert').textContent,'Passwords must match');assert.equal(button('Register').disabled,true);change('Confirm','longpass');assert.equal(view.queryByRole('alert'),null);assert.equal(field('Confirm').getAttribute('aria-invalid'),'false');click('Register');assert.equal(status(),'Registered');change('Password','different');assert.equal(button('Register').disabled,true);assert.ok(view.getByText('Passwords must match'));
};
