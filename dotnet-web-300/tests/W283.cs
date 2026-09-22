using static DotnetWeb.W283;
namespace DotnetWeb;
public static class TestsW283 { public static async Task Run() {
 await Task.CompletedTask;
{
  var store=new Store();var c=Check.Context();c.Request.Headers["Idempotency-Key"]="k";var first=await Check.Execute(Handle(c.Request,"a",store));Check.Equal(201,first.Response.StatusCode);Check.Equal("/submissions/1",first.Response.Headers.Location.ToString());var replay=await Check.Execute(Handle(c.Request,"a",store));Check.Equal(200,replay.Response.StatusCode);Check.Equal(Check.Body(first),Check.Body(replay));Check.Status(409,Handle(c.Request,"b",store));Check.Equal(1,store.Records.Count);Check.Equal(1,store.NextId);
 }
 {
 var s=new Store();Check.Status(400,Handle(Check.Context().Request,"a",s));var c=Check.Context();c.Request.Headers["Idempotency-Key"]=new StringValues(new[]{"k","k"});Check.Status(400,Handle(c.Request,"a",s));c.Request.Headers["Idempotency-Key"]=new string('a',11);Check.Status(400,Handle(c.Request,"a",s));Check.Equal(0,s.Records.Count);c.Request.Headers["Idempotency-Key"]=new string('a',10);Check.Status(201,Handle(c.Request,"",s));
 }
} }
