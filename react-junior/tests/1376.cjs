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
assert.equal(field('Celsius').value,'');assert.equal(field('Fahrenheit').value,'');change('Celsius','100');assert.equal(field('Fahrenheit').value,'212.0');change('Fahrenheit','32');assert.equal(field('Celsius').value,'0.0');assert.equal(field('Fahrenheit').value,'32');change('Celsius','-40');assert.equal(field('Fahrenheit').value,'-40.0');change('Celsius','oops');assert.equal(field('Celsius').value,'oops');assert.equal(field('Fahrenheit').value,'');change('Fahrenheit','50');change('Fahrenheit','');assert.equal(field('Celsius').value,'');change('Celsius','Infinity');assert.equal(field('Fahrenheit').value,'');
};
