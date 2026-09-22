using static DotnetWeb.W215;
namespace DotnetWeb;
public static class TestsW215 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","teams.read"),null,"permission-5")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","teams.read"),null,"permission-5")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-5")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","teams.read")},"test")),null,"permission-5")).Succeeded);
 }
} }
