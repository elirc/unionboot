using static DotnetWeb.W211;
namespace DotnetWeb;
public static class TestsW211 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","orders.read"),null,"permission-1")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","orders.read"),null,"permission-1")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-1")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","orders.read")},"test")),null,"permission-1")).Succeeded);
 }
} }
