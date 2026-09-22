using static DotnetWeb.W169;
namespace DotnetWeb;
public static class TestsW169 { public static async Task Run() {
 await Task.CompletedTask;
{
  int calls=0;var c=Check.Context();c.Response.Headers["X-Exercise-9"]="old";c.Response.Headers["X-Keep"]="yes";await Wrap(async x=>{calls++;Check.Equal("web-9",x.Response.Headers["X-Exercise-9"].ToString());await x.Response.WriteAsync("ok");})(c);Check.Equal(1,calls);Check.Equal("ok",Check.Body(c));Check.Equal("yes",c.Response.Headers["X-Keep"].ToString());
 }
 {
 await Check.ThrowsAsync<InvalidOperationException>(()=>Wrap(_=>throw new InvalidOperationException("downstream"))(Check.Context()));Check.Throws<ArgumentNullException>(()=>Wrap(null!));
 }
} }
