const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"initialItems":[{"id":"p","name":"Pen","price":100,"quantity":1},{"id":"b","name":"Book","price":250,"quantity":1}]};props.initialItems.forEach(Object.freeze);Object.freeze(props.initialItems);
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const out=n=>view.getByRole('status',{name:n}).textContent;assert.equal(out('Total'),'350');click('Increase Pen');assert.equal(out('Quantity Pen'),'2');assert.equal(out('Quantity Book'),'1');assert.equal(out('Total'),'450');click('Decrease Book');assert.equal(out('Total'),'200');assert.equal(button('Decrease Book').disabled,true);click('Decrease Book');assert.equal(out('Quantity Book'),'0');assert.deepEqual(props.initialItems,[{id:'p',name:'Pen',price:100,quantity:1},{id:'b',name:'Book',price:250,quantity:1}]);
};
