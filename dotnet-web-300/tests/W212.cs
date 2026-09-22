using static DotnetWeb.W212;
namespace DotnetWeb;
public static class TestsW212 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","tickets.read"),null,"permission-2")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","tickets.read"),null,"permission-2")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-2")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","tickets.read")},"test")),null,"permission-2")).Succeeded);
 }
} }
