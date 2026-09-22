const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"items":[{"id":1,"name":"Golden","tier":"gold"},{"id":2,"name":"Silvery","tier":"silver","stars":2},{"id":3,"name":"Goldenrod","tier":"gold"},{"id":4,"name":"Tin","tier":"silver"}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'4');change('Tier','gold');assert.equal(status(),'2');change('Min length','4');assert.deepEqual(view.getAllByRole('listitem').map(x=>x.textContent),['Golden','Goldenrod']);change('Tier','silver');assert.equal(status(),'1');assert.deepEqual(view.getAllByRole('listitem').map(x=>x.textContent),['Silvery']);view.rerender(React.createElement(Component,{items:props.items,noise:1}));assert.equal(field('Tier').value,'silver');assert.equal(field('Min length').value,'4');view.rerender(React.createElement(Component,{items:[{id:5,name:'Silverware',tier:'silver'}]}));assert.equal(status(),'1');assert.deepEqual(view.getAllByRole('listitem').map(x=>x.textContent),['Silverware']);
};
