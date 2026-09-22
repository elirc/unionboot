const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"words":["pear","fig","apple"]};Object.freeze(props.words);
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const items=()=>view.queryAllByRole('listitem').map(x=>x.textContent);assert.deepEqual(items(),['pear','fig','apple']);click('Sort');assert.deepEqual(items(),['apple','fig','pear']);click('Unsort');assert.deepEqual(items(),['pear','fig','apple']);click('Sort');assert.deepEqual(items(),['apple','fig','pear']);assert.deepEqual(props.words,['pear','fig','apple']);
};
