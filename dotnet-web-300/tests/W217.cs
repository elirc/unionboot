using static DotnetWeb.W217;
namespace DotnetWeb;
public static class TestsW217 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","files.read"),null,"permission-7")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","files.read"),null,"permission-7")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-7")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","files.read")},"test")),null,"permission-7")).Succeeded);
 }
} }
