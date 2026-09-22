using static DotnetWeb.W218;
namespace DotnetWeb;
public static class TestsW218 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","lists.write"),null,"permission-8")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","lists.write"),null,"permission-8")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-8")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","lists.write")},"test")),null,"permission-8")).Succeeded);
 }
} }
