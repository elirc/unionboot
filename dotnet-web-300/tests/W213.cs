using static DotnetWeb.W213;
namespace DotnetWeb;
public static class TestsW213 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","notes.write"),null,"permission-3")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","notes.write"),null,"permission-3")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-3")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","notes.write")},"test")),null,"permission-3")).Succeeded);
 }
} }
