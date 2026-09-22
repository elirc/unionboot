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
assert.equal(status(),'0.00');change('Bill','90');change('People','3');assert.equal(status(),'33.00');change('Tip percent','20');assert.equal(status(),'36.00');for(const value of ['0','-1','1.5','']){change('People',value);assert.equal(status(),'—');}change('People','2');change('Bill','-5');assert.equal(status(),'—');change('Bill','100');change('Tip percent','101');assert.equal(status(),'—');change('Tip percent','0');assert.equal(status(),'50.00');
};
