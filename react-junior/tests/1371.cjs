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
const out=n=>view.getByRole('status',{name:n}).textContent;assert.equal(out('Score'),'0:0');click('Goal Red');click('Goal Red');click('Goal Blue');assert.equal(out('Score'),'2:1');click('End match');assert.equal(out('Match'),'final');assert.equal(button('Goal Red').disabled,true);assert.equal(button('Goal Blue').disabled,true);assert.equal(button('End match').disabled,true);click('Goal Red');assert.equal(out('Score'),'2:1');click('New match');assert.equal(out('Score'),'0:0');assert.equal(out('Match'),'playing');click('Goal Blue');assert.equal(out('Score'),'0:1');
};
