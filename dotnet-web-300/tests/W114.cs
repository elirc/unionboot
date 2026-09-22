using static DotnetWeb.W114;
namespace DotnetWeb;
public static class TestsW114 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(await Handle(Check.FormRequest("nickname=Ada+L").Request));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"nickname","Ada L");
 }
 {
 Check.Equal(200, (await Check.Execute(await Handle(Check.FormRequest("nickname="+new string('a',11)).Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.FormRequest("nickname="+new string('a',12)).Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.FormRequest("nickname=a&nickname=b").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.FormRequest("").Request))).Response.StatusCode);
 }
 {
 Check.Equal(415, (await Check.Execute(await Handle(Check.Context().Request))).Response.StatusCode);
 }
} }
