using static DotnetWeb.W180;
namespace DotnetWeb;
public static class TestsW180 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Response.Headers["X-Partial"]="remove";await Wrap(_=>throw new DomainFault("private"))(c);Check.Equal(409,c.Response.StatusCode);Check.True(!c.Response.Headers.ContainsKey("X-Partial"));Check.Json(c,"title","Request rejected");Check.Json(c,"detail","domain-fault");Check.True(!Check.Body(c).Contains("private"));
 }
 {
 await Check.ThrowsAsync<InvalidOperationException>(()=>Wrap(_=>throw new InvalidOperationException())(Check.Context()));var ok=Check.Context();await Wrap(x=>x.Response.WriteAsync("done"))(ok);Check.Equal("done",Check.Body(ok));
 }
 {
 var started=Check.StartedContext();await Check.ThrowsAsync<DomainFault>(()=>Wrap(_=>throw new DomainFault("late"))(started));
 }
} }
