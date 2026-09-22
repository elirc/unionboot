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
click('Next');assert.ok(field('Improvement'));assert.equal(button('Finish').disabled,true);change('Improvement','more time');click('Back');fireEvent.click(field('Enjoyed it'));click('Next');assert.ok(field('Praise'));assert.equal(button('Finish').disabled,true);change('Praise',' Helpful ');click('Back');fireEvent.click(field('Enjoyed it'));click('Next');assert.equal(field('Improvement').value,'more time');click('Back');fireEvent.click(field('Enjoyed it'));click('Next');assert.equal(field('Praise').value,' Helpful ');click('Finish');assert.equal(status(),'Praise: Helpful');assert.equal(view.queryAllByRole('button').length,0);
};
