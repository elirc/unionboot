const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"rows":[{"id":"z","name":"Zed","score":5},{"id":"a","name":"Ada","score":2},{"id":"b","name":"Bo","score":2}]};props.rows.forEach(Object.freeze);Object.freeze(props.rows);
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const names=()=>view.queryAllByRole('listitem').map(x=>x.textContent);assert.deepEqual(names(),['Zed','Ada','Bo']);click('Score');assert.equal(status(),'ascending');assert.deepEqual(names(),['Ada','Bo','Zed']);click('Score');assert.deepEqual(names(),['Zed','Ada','Bo']);assert.equal(status(),'descending');click('Score');assert.equal(status(),'original');assert.deepEqual(names(),['Zed','Ada','Bo']);click('Score');view.rerender(React.createElement(Component,{rows:[{id:'x',name:'Only',score:4}]}));assert.equal(status(),'ascending');assert.deepEqual(names(),['Only']);assert.equal(props.rows[0].name,'Zed');
};
