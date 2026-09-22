const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"entries":[{"id":1,"title":"Alpha one","kind":"kindA","stars":3},{"id":2,"title":"Beta two","kind":"kindB","stars":2},{"id":3,"title":"Gamma three","kind":"kindA","stars":2},{"id":4,"title":"Delta four","kind":"kindB","stars":3}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const titles=()=>view.queryAllByRole('listitem').map(x=>x.textContent);assert.equal(status(),'4');change('Kind','kindA');assert.equal(status(),'2');change('Stars','3');assert.equal(status(),'1');assert.deepEqual(titles(),['Alpha one']);change('Kind','kindB');assert.equal(status(),'1');assert.deepEqual(titles(),['Delta four']);change('Kind','all');assert.equal(status(),'2');change('Stars','all');change('Kind','kindA');change('Stars','3');assert.deepEqual(titles(),['Alpha one']);
};
