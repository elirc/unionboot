const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"initialComments":[{"id":"c1","text":"first"}]};const pending=[],calls=[];props.submitComment=text=>{calls.push(text);return new Promise((resolve,reject)=>pending.push({resolve,reject}));};Object.freeze(props.initialComments[0]);Object.freeze(props.initialComments);
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const texts=()=>view.queryAllByRole('listitem').map(x=>x.textContent);assert.deepEqual(texts(),['first']);assert.equal(button('Post').disabled,true);change('Comment',' mine ');click('Post');assert.deepEqual(texts(),['mine','first']);assert.equal(status(),'2');assert.equal(button('Post').disabled,true);assert.equal(calls[0],'mine');await act(async()=>pending[0].resolve(true));assert.equal(field('Comment').value,'');change('Comment','bad');click('Post');assert.deepEqual(texts(),['bad','mine','first']);await act(async()=>pending[1].resolve(false));assert.deepEqual(texts(),['mine','first']);assert.equal(status(),'2');assert.equal(field('Comment').value,'bad');assert.equal(button('Post').disabled,false);assert.equal(view.getByRole('alert').textContent,'Post rejected');click('Post');assert.equal(view.queryByRole('alert'),null);await act(async()=>pending[2].reject(new Error('offline')));assert.deepEqual(texts(),['mine','first']);click('Post');await act(async()=>pending[3].resolve(true));assert.deepEqual(texts(),['bad','mine','first']);assert.deepEqual(props.initialComments,[{id:'c1',text:'first'}]);
};
