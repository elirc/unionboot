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
assert.ok(view.getByRole('group',{name:'Delivery method'}));assert.equal(button('Place order').disabled,true);change('Address',' Main St ');fireEvent.click(view.getByRole('radio',{name:'Pickup'}));assert.equal(view.queryByLabelText('Address'),null);assert.equal(status(),'');click('Place order');assert.equal(status(),'Pickup');fireEvent.click(view.getByRole('radio',{name:'Shipping'}));assert.equal(field('Address').value,' Main St ');click('Place order');assert.equal(status(),'Ship: Main St');change('Address',' ');assert.equal(button('Place order').disabled,true);
};
