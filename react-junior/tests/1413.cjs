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
const label=()=>status('Label'),detail=()=>status('Detail');assert.equal(label(),'Awaiting payment');assert.equal(detail(),'PENDING:Awaiting payment');view.rerender(React.createElement(Component,{status:'PAID'}));assert.equal(label(),'Payment received');view.rerender(React.createElement(Component,{status:'failed'}));assert.equal(label(),'Payment failed');view.rerender(React.createElement(Component,{status:'mystery'}));assert.equal(label(),'Status unknown');view.rerender(React.createElement(Component,{status:''}));assert.equal(label(),'Status unknown');view.rerender(React.createElement(Component,{status:'constructor'}));assert.equal(label(),'Status unknown');
};
