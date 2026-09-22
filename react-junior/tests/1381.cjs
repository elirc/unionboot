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
assert.equal(button('Reserve').disabled,true);change('Start','2026-09-20');change('End','2026-09-19');assert.equal(view.getByRole('alert').textContent,'End must not precede start');assert.equal(button('Reserve').disabled,true);change('End','2026-09-20');assert.equal(view.queryByRole('alert'),null);click('Reserve');assert.equal(status(),'2026-09-20 to 2026-09-20');change('End','2026-10-01');click('Reserve');assert.equal(status(),'2026-09-20 to 2026-10-01');change('Start','');assert.equal(button('Reserve').disabled,true);assert.equal(status(),'2026-09-20 to 2026-10-01');
};
