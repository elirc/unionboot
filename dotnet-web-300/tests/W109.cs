using static DotnetWeb.W109;
namespace DotnetWeb;
public static class TestsW109 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(await Handle(Check.JsonRequest("{\"count\":0}").Request));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"count",0);
 }
 {
 Check.Equal(200, (await Check.Execute(await Handle(Check.JsonRequest("{\"count\":11}").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.JsonRequest("{\"count\":12}").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.JsonRequest("{\"count\":\"1\"}").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.JsonRequest("{").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(await Handle(Check.JsonRequest("[]").Request))).Response.StatusCode);
 }
 {
 Check.Equal(415, (await Check.Execute(await Handle(Check.Context().Request))).Response.StatusCode);
 }
 {
 var canceled=Check.JsonRequest("{\"count\":1}");canceled.RequestAborted=new CancellationToken(true);await Check.ThrowsAsync<OperationCanceledException>(async()=>{await Handle(canceled.Request);});
 }
} }
