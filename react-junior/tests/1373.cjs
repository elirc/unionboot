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
change('Theme','dark');fireEvent.click(field('SMS'));fireEvent.click(field('Email'));assert.deepEqual(JSON.parse(status()),{notifications:{email:false,sms:true},theme:'dark'});fireEvent.click(field('Email'));assert.deepEqual(JSON.parse(status()),{notifications:{email:true,sms:true},theme:'dark'});click('Reset');assert.deepEqual(JSON.parse(status()),{notifications:{email:true,sms:false},theme:'light'});assert.equal(field('SMS').checked,false);
};
