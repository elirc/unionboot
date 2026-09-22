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
const count=key=>status('Count '+key);click('Bump A');click('Bump A');click('Bump B');assert.equal(count('A'),'2');assert.equal(count('B'),'1');assert.equal(count('C'),'0');click('Bump C');click('Reset all');assert.equal(count('A'),'0');assert.equal(count('B'),'0');assert.equal(count('C'),'0');click('Bump C');assert.equal(count('C'),'1');
};
