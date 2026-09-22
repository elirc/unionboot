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
assert.equal(status(),'0');fireEvent.click(view.getByRole('button',{name:'Rate 3 out of 5'}));assert.equal(status(),'3');assert.equal(view.getByRole('button',{name:'Rate 3 out of 5'}).getAttribute('aria-pressed'),'true');assert.equal(view.getByRole('button',{name:'Rate 5 out of 5'}).getAttribute('aria-pressed'),'false');fireEvent.click(view.getByRole('button',{name:'Rate 5 out of 5'}));assert.equal(status(),'5');click('Clear');assert.equal(status(),'0');
};
