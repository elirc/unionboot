'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={"rows":[{"id":"a","name":"zoe","score":null},{"id":"b","name":"Ada","score":2},{"id":"c","name":"ada","score":2},{"id":"d","name":"Bob","score":0},{"id":"e","name":"Ada","score":-1}]};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}

freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const ids=()=>view.getAllByRole('row').slice(1).map(r=>r.cells[0].textContent);const check=(expected,key,direction)=>{deep(ids(),expected);eq(button(key).closest('th').getAttribute('aria-sort'),direction);eq(button(key==='Name'?'Score':'Name').closest('th').getAttribute('aria-sort'),'none');};check(["b","c","d","e","a"],'Score','descending');click('Score');check(["e","d","b","c","a"],'Score','ascending');click('Name');check(["b","e","d","c","a"],'Name','ascending');click('Name');check(["a","c","d","b","e"],'Name','descending');assert.ok(view.getByText('—'));deep(props.rows,[{"id":"a","name":"zoe","score":null},{"id":"b","name":"Ada","score":2},{"id":"c","name":"ada","score":2},{"id":"d","name":"Bob","score":0},{"id":"e","name":"Ada","score":-1}]);view.rerender(React.createElement(Component,{rows:[]}));eq(view.getAllByRole('row').length,1);
} finally {for(const restore of after.reverse())restore();}
};
