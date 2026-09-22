using static DotnetWeb.W267;
namespace DotnetWeb;
public static class TestsW267 { public static async Task Run() {
 await Task.CompletedTask;
{
  int calls=0;var c=Check.Context();c.Response.Headers.Vary="Origin";c.Response.Headers.CacheControl="old";await Wrap(_=>{calls++;return Task.CompletedTask;})(c);Check.Equal("public, max-age=105",c.Response.Headers.CacheControl.ToString());Check.Equal("Origin, Accept",c.Response.Headers.Vary.ToString());Check.Equal(1,calls);
 }
 {
 var privateC=Check.Context();privateC.User=Check.User(true,"x","y");privateC.Response.Headers.Vary="accept";await Wrap(_=>Task.CompletedTask)(privateC);Check.Equal("no-store",privateC.Response.Headers.CacheControl.ToString());Check.Equal("accept",privateC.Response.Headers.Vary.ToString());var star=Check.Context();star.Response.Headers.Vary="*";await Wrap(_=>Task.CompletedTask)(star);Check.Equal("*",star.Response.Headers.Vary.ToString());
 }
} }
