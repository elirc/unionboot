using static DotnetWeb.W214;
namespace DotnetWeb;
public static class TestsW214 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","tasks.write"),null,"permission-4")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","tasks.write"),null,"permission-4")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-4")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","tasks.write")},"test")),null,"permission-4")).Succeeded);
 }
} }
