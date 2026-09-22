'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}

freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const field=input('Password');eq(field.type,'password');eq(status(),'short');for(const [value,expected] of [["aaaaaa","short"],["aaaaaaa","digit"],["aaaaaa7","ready"],["77777777777","ready"],["777777777777","long"],[" 777777 ","ready"]]){change('Password',value);eq(status(),expected);}const kept=field.value;eq(button('Show').type,'button');click('Show');eq(field.type,'text');eq(button('Hide').getAttribute('aria-pressed'),'true');eq(field.value,kept);fireEvent.blur(field);eq(field.type,'password');eq(button('Show').getAttribute('aria-pressed'),'false');click('Show');click('Hide');eq(field.value,kept);click('Show');click('Clear');eq(field.value,'');eq(field.type,'password');eq(status(),'short');
} finally {for(const restore of after.reverse())restore();}
};
