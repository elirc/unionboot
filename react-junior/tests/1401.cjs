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
const input=field('Username');assert.ok(input.getAttribute('aria-describedby'));fireEvent.blur(input);assert.equal(view.getByRole('alert').textContent,'Use 3-10 lowercase letters or digits');assert.equal(input.getAttribute('aria-invalid'),'true');const ids=input.getAttribute('aria-describedby').split(' ');assert.ok(ids.length===2);assert.notEqual(ids[0],ids[1]);assert.equal(document.getElementById(ids[0]).textContent,'Lowercase letters and digits only');assert.equal(document.getElementById(ids[1]).textContent,'Use 3-10 lowercase letters or digits');change('Username','okay');assert.equal(status(),'valid');change('Username','AB');fireEvent.blur(input);assert.equal(view.getByRole('alert').textContent,'Use 3-10 lowercase letters or digits');change('Username','goodname');assert.equal(view.queryByRole('alert'),null);assert.equal(input.getAttribute('aria-invalid'),'false');assert.equal(input.getAttribute('aria-describedby').split(' ').length,1);
};
