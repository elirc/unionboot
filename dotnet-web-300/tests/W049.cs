using static DotnetWeb.W049;
namespace DotnetWeb;
public static class TestsW049 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?page=2&size=2").Request,new[]{1,2,3,4,5}));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"items",new[]{3,4});Check.Json(c,"total",5);
 }
 {
 var c2=await Check.Execute(Handle(Check.Context("").Request,Array.Empty<int>()));Check.Json(c2,"size",10);Check.Json(c2,"items",Array.Empty<int>());
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?page=0").Request,new[]{1}))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?size=19").Request,new[]{1}))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?page=1&page=2").Request,new[]{1}))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?page=wat").Request,new[]{1}))).Response.StatusCode);
 }
 {
 var end=await Check.Execute(Handle(Check.Context("?page=2147483647&size=18").Request,new[]{1}));Check.Json(end,"items",Array.Empty<int>());
 }
} }
