using static DotnetWeb.W220;
namespace DotnetWeb;
public static class TestsW220 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","drafts.write"),null,"permission-10")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","drafts.write"),null,"permission-10")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-10")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","drafts.write")},"test")),null,"permission-10")).Succeeded);
 }
} }
