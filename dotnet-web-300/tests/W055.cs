using static DotnetWeb.W055;
namespace DotnetWeb;
public static class TestsW055 { public static async Task Run() {
 await Task.CompletedTask;
{
  var rows=new[]{new Item(3,"Tea",true),new Item(1,"Tea",true),new Item(2,"Tea",false),new Item(4,"Milk",true)};var c=await Check.Execute(Handle(Check.Context("?q=te").Request,rows));Check.Equal(200,c.Response.StatusCode);Check.Equal("[{\"id\":1,\"name\":\"Tea\"},{\"id\":3,\"name\":\"Tea\"}]",Check.Body(c));Check.Equal(4,rows.Length);
 }
 {
 var c2=await Check.Execute(Handle(Check.Context("").Request,Enumerable.Range(1,8).Select(n=>new Item(n,n.ToString("D2"),true)).ToArray()));using var d=JsonDocument.Parse(Check.Body(c2));Check.Equal(6,d.RootElement.GetArrayLength());Check.Equal(1,d.RootElement[0].GetProperty("id").GetInt32());
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?q=a&q=b").Request,Array.Empty<Item>()))).Response.StatusCode);
 }
 {
 var empty=await Check.Execute(Handle(Check.Context("?q=absent").Request,Array.Empty<Item>()));Check.Equal("[]",Check.Body(empty));
 }
} }
