using static DotnetWeb.W219;
namespace DotnetWeb;
public static class TestsW219 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","reports.read"),null,"permission-9")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","reports.read"),null,"permission-9")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-9")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","reports.read")},"test")),null,"permission-9")).Succeeded);
 }
} }
