using static DotnetWeb.W170;
namespace DotnetWeb;
public static class TestsW170 { public static async Task Run() {
 await Task.CompletedTask;
{
  int calls=0;var c=Check.Context();c.Response.Headers["X-Exercise-10"]="old";c.Response.Headers["X-Keep"]="yes";await Wrap(async x=>{calls++;Check.Equal("web-10",x.Response.Headers["X-Exercise-10"].ToString());await x.Response.WriteAsync("ok");})(c);Check.Equal(1,calls);Check.Equal("ok",Check.Body(c));Check.Equal("yes",c.Response.Headers["X-Keep"].ToString());
 }
 {
 await Check.ThrowsAsync<InvalidOperationException>(()=>Wrap(_=>throw new InvalidOperationException("downstream"))(Check.Context()));Check.Throws<ArgumentNullException>(()=>Wrap(null!));
 }
} }
